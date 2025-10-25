import lo from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import Ticket from './Ticket';
import type {
  TransactionNode,
  DetailedBookingDetailsFragment,
  BookingNode,
  SeatGroupNode,
  ConcessionTypeNode
} from '~~/graphql/codegen/operations';
import type { IdInput } from '~~/types/generic';
import TicketsMatrix from './TicketsMatrix';
import type { DateTime } from 'luxon';

export default class Booking {
  id?: IdInput;
  reference?: string;
  performance?: Pick<BookingNode['performance'], 'id' | 'start'>;
  transactions: TransactionNode[];
  tickets: Ticket[];
  priceBreakdown?: DetailedBookingDetailsFragment['priceBreakdown'];
  dirty: boolean = false;
  raw?: DetailedBookingDetailsFragment;
  idempotencyKey?: string;
  user?: DetailedBookingDetailsFragment['user'];
  accessibilityInfo?: string;
  previousAccessibilityInfo?: string;
  accessibilityInfoUpdatedAt?: DateTime;
  canModifyAccessibility?: boolean;

  constructor() {
    this.tickets = [];
    this.transactions = [];
    this.refreshIdempotencyKey();
  }

  /**
   * Creates a booking object from an API response
   *
   * @param {object} bookingData API Booking Data
   * @returns {Booking} A Booking Instance
   * @static
   */
  static fromAPIData(bookingData: DetailedBookingDetailsFragment) {
    const booking = new this();
    booking.updateFromAPIData(bookingData);
    return booking;
  }

  /**
   * Updates the booking object from an API response
   *
   * @param {object} bookingData API Booking Data
   */
  updateFromAPIData(bookingData: DetailedBookingDetailsFragment) {
    this.raw = bookingData;
    if (bookingData.priceBreakdown) {
      this.priceBreakdown = bookingData.priceBreakdown;
    }
    if (bookingData.tickets) {
      this.tickets = bookingData.tickets.map((ticketAPIData) =>
        Ticket.fromAPIData(ticketAPIData)
      );
    }
    if (bookingData.performance) {
      this.performance = bookingData.performance;
    }
    if (bookingData.reference) {
      this.reference = bookingData.reference;
    }
    if (bookingData.user) {
      this.user = bookingData.user;
    }
    if (bookingData.accessibilityInfo) {
      this.accessibilityInfo = bookingData.accessibilityInfo;
    }
    if (bookingData.accessibilityInfoUpdatedAt) {
      this.accessibilityInfoUpdatedAt = bookingData.accessibilityInfoUpdatedAt;
    }
    if (bookingData.previousAccessibilityInfo) {
      this.previousAccessibilityInfo = bookingData.previousAccessibilityInfo;
    }
    if (bookingData.canModifyAccessibility) {
      this.canModifyAccessibility = bookingData.canModifyAccessibility;
    }
    if (bookingData.transactions && bookingData.transactions.edges.length) {
      this.transactions = bookingData.transactions.edges
        .map((edge) => edge?.node)
        .filter(
          (transaction) => transaction !== undefined
        ) as TransactionNode[];
    }
    this.id = bookingData.id;
    this.dirty = false;
  }

  /**
   * Returns the booking in the API booking model schema
   *
   * @returns {object} Booking Object
   */
  toAPIData() {
    return {
      tickets: this.tickets?.map((ticket) => {
        return ticket.apiData;
      })
    };
  }

  /**
   * Adds a ticket to the booking
   *
   * @param {Ticket} ticket Ticket to add
   * @param {TicketsMatrix} ticketMatrix TicketMatrix Object
   * @param {number} number Number of tickets to add
   */
  addTicket(ticket: Ticket, ticketMatrix: TicketsMatrix, number = 1) {
    if (!ticketMatrix.canAddTickets(number, ticket.seatGroup.id)) {
      return;
    }

    for (let i = 0; i < number; i++) {
      this.tickets.push(ticket);
      ticketMatrix.decrementPerformanceCapacity();
      if (ticket.seatGroup.id)
        ticketMatrix.decrementSeatGroupCapacity(ticket.seatGroup.id);
    }
    this.dirty = true;
  }

  /**
   * Sets the number of tickets for a certain seat group and concession type to the given number
   *
   * @param {object|null} seatGroup Seat Group Object
   * @param {object|null} concessionType Concession Type Object
   * @param {number} count Number of tickets
   * @param {TicketsMatrix} ticketMatrix TicketMatrix Object
   */
  setTicketCount(
    seatGroup: SeatGroupNode | undefined = undefined,
    concessionType: ConcessionTypeNode | undefined = undefined,
    count: number,
    ticketMatrix: TicketsMatrix
  ) {
    let rollingTotal = 0;

    // Step 1 - Check how many matching tickets we have for the criteria. Remove if required (and update TicketMatrix)
    this.tickets = this.tickets.filter((ticket) => {
      if (ticket.matches(seatGroup, concessionType)) {
        rollingTotal++;
        if (rollingTotal > count) {
          // Remove this ticket
          ticketMatrix.incrementPerformanceCapacity();
          if (seatGroup) ticketMatrix.incrementSeatGroupCapacity(seatGroup.id);
          return false;
        }
      }
      return true;
    });

    if (!seatGroup || !concessionType) return;

    while (rollingTotal < count) {
      this.addTicket(new Ticket(seatGroup.id, concessionType.id), ticketMatrix);
      rollingTotal++;
    }
    this.dirty = true;
  }

  /**
   * Finds tickets, optionally by seat group or concession type
   *
   * @param {object|null} seatGroup Seat Group Object
   * @param {object|null} concessionType Concession Type Object
   * @returns {Ticket[]} Matching tickets
   */
  findTickets(
    seatGroup: SeatGroupNode | undefined = undefined,
    concessionType: ConcessionTypeNode | undefined = undefined
  ) {
    return this.tickets.filter((ticket) => {
      return ticket.matches(seatGroup, concessionType);
    });
  }

  /**
   * Removes 1 ticket by seat group and concession type
   *
   * @param {object} seatGroup Seat Group Object
   * @param {object} concessionType Concession Type Object
   * @param {TicketsMatrix} ticketMatrix TicketMatrix Object
   */
  removeTicket(
    seatGroup: SeatGroupNode,
    concessionType: ConcessionTypeNode,
    ticketMatrix: TicketsMatrix
  ) {
    this.setTicketCount(
      seatGroup,
      concessionType,
      this.ticketCount(seatGroup, concessionType) - 1,
      ticketMatrix
    );
    this.dirty = true;
  }

  /**
   * Finds the number of tickets, optionally by seat group or concession type
   *
   * @param  seatGroup Seat Group Object
   * @param  concessionType Concession Type Object
   * @returns {number} Number of matching tickets
   */
  ticketCount(seatGroup?: SeatGroupNode, concessionType?: ConcessionTypeNode) {
    return this.findTickets(seatGroup, concessionType).length;
  }

  /**
   * Clears the booking's tickets
   */
  clearTickets() {
    this.tickets = [];
    this.dirty = true;
  }

  /**
   * Calculates the total price (in pennies) of the tickets (pre-discounts/charges)
   *
   * @param {TicketsMatrix} ticketMatrix Ticket Matrix instance
   * @returns {number} Total price of the tickets (without discounts), in pennies
   */
  ticketsTotalPriceEstimate(ticketMatrix: TicketsMatrix) {
    return this.tickets
      .map((ticket) => ticket.price(ticketMatrix.ticketOptions))
      .reduce((a, b) => (a ?? 0) + (b ?? 0), 0);
  }

  /**
   * Calculates the total price (in pounds) of the tickets (pre-discounts/charges)
   *
   * @param {TicketsMatrix} ticketMatrix Ticket Matrix instance
   * @returns {number} Total price of the booking, in pounds to 2 d.p.
   */
  ticketsTotalPricePoundsEstimate(ticketMatrix: TicketsMatrix) {
    return ((this.ticketsTotalPriceEstimate(ticketMatrix) ?? 0) / 100).toFixed(
      2
    );
  }

  get allCheckedIn() {
    return this.tickets.every((ticket) => ticket.checkedIn);
  }

  get numberCheckedIn() {
    return this.tickets.filter((ticket) => ticket.checkedIn).length;
  }

  /**
   * @returns {number} Total cost / price of the booking in pennies
   */
  get totalPrice() {
    if (!this.priceBreakdown) {
      return 0;
    }
    return this.priceBreakdown.totalPrice;
  }

  /**
   * @returns {string} Total cost / price of the booking in pounds
   */
  get totalPricePounds() {
    return (this.totalPrice / 100).toFixed(2);
  }

  /**
   * @returns {string} Price of tickets minus any discounts in pounds
   */
  get subTotalPricePounds() {
    if (!this.priceBreakdown) {
      return (0).toFixed(2);
    }
    return (this.priceBreakdown.subtotalPrice / 100).toFixed(2);
  }

  /**
   * @returns {string} Total cost / price of the tickets in pounds
   */
  get ticketsPricePounds() {
    if (!this.priceBreakdown) {
      return (0).toFixed(2);
    }
    return (this.priceBreakdown.ticketsPrice / 100).toFixed(2);
  }

  /**
   * @returns {string} Total cost / price of the tickets in pounds taking into account any discounts
   */
  get ticketsDiscountedPricePounds() {
    if (!this.priceBreakdown) {
      return (0).toFixed(2);
    }
    return (this.priceBreakdown.ticketsDiscountedPrice / 100).toFixed(2);
  }

  /**
   * @returns {boolean} True if the booking has discounts applied
   */
  get hasDiscounts() {
    if (!this.priceBreakdown) {
      return false;
    }
    return this.priceBreakdown.discountsValue !== 0;
  }

  /**
   * @returns {string} Total cost / price of the group discounts in pounds
   */
  get discountsValuePounds() {
    if (!this.priceBreakdown) {
      return (0).toFixed(2);
    }
    return (this.priceBreakdown.discountsValue / 100).toFixed(2);
  }

  /**
   * @param {TicketsMatrix} ticketMatrix Ticket Matrix instance
   * @returns {Array} List of tickets grouped by seat group & concession type, giving capacity and price
   */
  ticketOverview(ticketMatrix?: TicketsMatrix) {
    if (!this.priceBreakdown || this.dirty) {
      if (!ticketMatrix) {
        throw new Error(
          'A ticket matrix is required to generate the ticket overview'
        );
      }
      return this.ticketOverviewEstimate(ticketMatrix);
    }
    return this.priceBreakdown.tickets;
  }

  /**
   * @param {TicketsMatrix} ticketMatrix Ticket Matrix instance
   * @returns {Array} List of tickets grouped by seat group & concession type, giving capacity and price (based on selected tickets and not API data)
   */
  ticketOverviewEstimate(ticketMatrix: TicketsMatrix) {
    return lo
      .chain(this.tickets)
      .groupBy((ticket) => [ticket.seatGroup.id, ticket.concessionType.id])
      .values()
      .map((groupedTickets) => {
        const option = ticketMatrix.ticketOptions.find(
          (option) => option?.seatGroup.id === groupedTickets[0]?.seatGroup.id
        );

        if (!option) {
          throw new Error(
            `No matching ticket option found for ticket details (Seat Group ID: ${groupedTickets[0]?.seatGroup.id})`
          );
        }

        const seatGroup = option.seatGroup;
        const concessionTypeEdge = option.concessionTypes?.find(
          (concessionTypeEdge) =>
            concessionTypeEdge?.concessionType?.id ===
            groupedTickets[0]?.concessionType?.id
        );

        if (!concessionTypeEdge) {
          throw new Error(
            `No matching concession type found for ticket details (Concession Type ID: ${groupedTickets[0]?.concessionType?.id})`
          );
        }

        return {
          number: groupedTickets.length,
          concessionType: concessionTypeEdge.concessionType,
          seatGroup,
          ticketPrice: concessionTypeEdge.price,
          totalPrice: (concessionTypeEdge.price ?? 0) * groupedTickets.length
        };
      })
      .value();
  }

  /**
   * @returns {Array} List of misc costs, giving name, description, an optional perctange value and the additional cost (in pounds)
   */
  get miscCosts() {
    if (!this.priceBreakdown) {
      return [];
    }
    return (
      this.priceBreakdown.miscCosts?.map((miscCost) => {
        return Object.assign(miscCost ?? {}, {
          valuePounds: ((miscCost?.value ?? 0) / 100).toFixed(2)
        });
      }) ?? []
    );
  }

  get status() {
    if (!this.raw?.status) {
      return '';
    }
    return this.raw.status;
  }

  refreshIdempotencyKey() {
    this.idempotencyKey = uuidv4();
  }
}
