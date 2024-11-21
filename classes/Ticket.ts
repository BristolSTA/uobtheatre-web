import InvalidTicketQRCodeException from '@/exceptions/InvalidTicketQRCodeException';
import type {
  ConcessionTypeNode,
  DetailedBookingDetailsFragment,
  SeatGroupNode,
  ExtendedUserNode
} from '~~/graphql/codegen/operations';
import type { IdInput } from '~~/types/generic';
import type { TicketOptions } from '~~/types/performance';
import { DateTime } from 'luxon';

export default class {
  seatGroup: Partial<
    Pick<SeatGroupNode, 'id' | 'name' | 'description' | 'capacity'>
  > = {};
  concessionType: Partial<
    Pick<ConcessionTypeNode, 'id' | 'name' | 'description'>
  > = {};
  checkedIn = false;
  checkedInAt?: DateTime;
  checkedInBy?: Partial<
    Pick<ExtendedUserNode, 'id' | 'firstName' | 'lastName'>
  >;
  id: IdInput | undefined = undefined;

  /**
   * @param {string} seatGroupId Seat Group / Location ID
   * @param {string} concessionTypeId Concession Type ID
   * @param {string} id Optional ID of ticket in database
   */
  constructor(seatGroupId: IdInput, concessionTypeId: IdInput, id?: IdInput) {
    this.seatGroup.id = seatGroupId;
    this.concessionType.id = concessionTypeId;
    this.id = id;
  }

  static fromAPIData(
    ticketAPIData: DetailedBookingDetailsFragment['tickets'][number]
  ) {
    const ticket = new this(
      ticketAPIData.seatGroup.id,
      ticketAPIData.concessionType.id,
      ticketAPIData.id
    );
    ticket.seatGroup = ticketAPIData.seatGroup;
    ticket.concessionType = ticketAPIData.concessionType;
    if (ticketAPIData.checkedInAt) {
      ticket.checkedIn = true;
      ticket.checkedInAt = DateTime.fromISO(ticketAPIData.checkedInAt);
    }
    if (ticketAPIData.checkedInBy) {
      ticket.checkedInBy = ticketAPIData.checkedInBy;
    }
    return ticket;
  }

  static dataFromQRCode(rawValue: string) {
    try {
      const result = JSON.parse(atob(rawValue));
      return {
        bookingReference: result[0],
        ticketId: result[1]
      };
    } catch (e) {
      if (
        e instanceof SyntaxError ||
        (e instanceof DOMException &&
          e.message.includes(
            'The string to be decoded is not correctly encoded'
          ))
      )
        throw new InvalidTicketQRCodeException();

      throw e;
    }
  }

  /**
   * Returns if this ticket matches the given parameters
   *
   * @param {object|undefined} seatGroup Seat Group Data Object
   * @param {object|undefined} concessionType Concession Data Object
   * @returns {boolean} True if ticket matches
   */
  matches(seatGroup?: { id: IdInput }, concessionType?: { id: IdInput }) {
    const matchesSeatGroup = seatGroup
      ? this.seatGroup.id === seatGroup.id
      : true;
    const matchesConcessionType = concessionType
      ? this.concessionType.id === concessionType.id
      : true;
    return matchesSeatGroup && matchesConcessionType;
  }

  /**
   * Returns the price for one of this ticket, based on the concession applied to the seat group
   *
   * @param {object} ticketOptions Raw data from the ticket_types endpoint (i.e. grouped Seat Group -> Concession Types data) which contains the price data
   * @returns {number} Price of the ticket in pennies
   */
  price(ticketOptions: TicketOptions): number | undefined {
    return (
      ticketOptions
        .find((option) => option?.seatGroup.id === this.seatGroup.id)
        ?.concessionTypes?.find(
          (concessionEdge) =>
            concessionEdge?.concessionType?.id === this.concessionType.id
        )?.price ?? undefined
    );
  }

  /**
   * Returns the Base 64 encoded string to use in the QR code
   *
   * @param {string} bookingReference Booking Reference
   * @returns {string} Base 64 encoded string
   */
  generateQRCodeString(bookingReference: string): string {
    return btoa(JSON.stringify([bookingReference, this.id]));
  }

  /**
   * @returns {object} API Data object that represents the ticket
   */
  get apiData(): {
    seatGroupId?: IdInput;
    concessionTypeId?: IdInput;
    id?: IdInput;
  } {
    const ticketData: {
      seatGroupId?: IdInput;
      concessionTypeId?: IdInput;
      id?: IdInput;
    } = {
      seatGroupId: this.seatGroup.id,
      concessionTypeId: this.concessionType.id,
      id: undefined
    };
    if (this.id) {
      ticketData.id = this.id;
    }

    return ticketData;
  }
}
