export default class {
  seat_group = {};
  concession_type = {};
  /**
   * @param {object} seat_group_id Seat Group / Location ID
   * @param {object} concession_type_id Concession Type ID
   */
  constructor(seat_group_id, concession_type_id) {
    this.seat_group.id = seat_group_id;
    this.concession_type.id = concession_type_id;
  }

  static fromAPIData(ticketAPIData) {
    let ticket = new this(
      ticketAPIData.seat_group.id,
      ticketAPIData.concession_type.id
    );
    ticket.seat_group = ticketAPIData.seat_group;
    ticket.concession_type = ticketAPIData.concession_type;
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
      .find(
        (seat_location) => seat_location.seat_group.id == this.seat_group.id
      )
      .concession_types.find(
        (concession) => concession.id == this.concession_type.id
      ).price;
  }

  /**
   * @returns {object} API Data object that represents the ticket
   */
  get apiData() {
    return {
      seat_group_id: this.seat_group.id,
      concession_type_id: this.concession_type.id,
    };
  }
}
