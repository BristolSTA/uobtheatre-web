export default class {
  seat_group = {};
  concession_type = {};
  id = null;

  /**
   * @param {object} seat_group_id Seat Group / Location ID
   * @param {object} concession_type_id Concession Type ID
   * @param {string} id Optional ID of ticket in database
   */
  constructor(seat_group_id, concession_type_id, id = null) {
    this.seat_group.id = seat_group_id;
    this.concession_type.id = concession_type_id;
    this.id = id;
  }

  static fromAPIData(ticketAPIData) {
    let ticket = new this(
      ticketAPIData.seatGroup.id,
      ticketAPIData.concessionType.id,
      ticketAPIData.id
    );
    ticket.seat_group = ticketAPIData.seatGroup;
    ticket.concession_type = ticketAPIData.concessionType;
    return ticket;
  }

  /**
   * Returns if this ticket matches the given parameters
   *
   * @param {object|null} seat_group Seat Group Data Object
   * @param {object|null} concession_type Concession Data Object
   * @returns {boolean} True if ticket matches
   */
  matches(seat_group, concession_type) {
    let matches_seat_group = seat_group
      ? this.seat_group.id == seat_group.id
      : true;
    let matches_concession_type = concession_type
      ? this.concession_type.id == concession_type.id
      : true;
    return matches_seat_group && matches_concession_type;
  }

  /**
   * Returns the price for one of this ticket, based on the concession applied to the seat group
   *
   * @param {object} ticket_options Raw data from the ticket_types endpoint (i.e. grouped Seat Group -> Concession Types data) which contains the price data
   * @returns {number} Price of the ticket in pennies
   */
  price(ticket_options) {
    return ticket_options
      .find((option) => option.seatGroup.id == this.seat_group.id)
      .concessionTypes.find(
        (concession_edge) =>
          concession_edge.concessionType.id == this.concession_type.id
      ).price;
  }

  /**
   * Returns the Base 64 encoded string to use in the QR code
   *
   * @param {string} booking_reference Booking Reference
   * @returns {string} Base 64 encoded string
   */
  generateQRCodeString(booking_reference) {
    return btoa([booking_reference, this.id]);
  }

  /**
   * @returns {object} API Data object that represents the ticket
   */
  get apiData() {
    if (this.id)
      return {
        id: this.id,
        seatGroupId: this.seat_group.id,
        concessionTypeId: this.concession_type.id,
      };
    return {
      seatGroupId: this.seat_group.id,
      concessionTypeId: this.concession_type.id,
    };
  }
}
