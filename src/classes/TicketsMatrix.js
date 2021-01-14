export default class {
  constructor(raw_ticket_types) {
    this.raw_ticket_types = raw_ticket_types;
  }

  get ticket_options() {
    return this.raw_ticket_types.ticket_types;
  }

  /**
   * @param {number} number Number of tickets requested to book
   * @param {?number} seat_group_capacity Optional capacity for seat groupt to also check against
   * @returns {boolean} Whether tickets can be added
   */
  canAddTickets(number, seat_group_capacity = null) {
    if (seat_group_capacity != null && number > seat_group_capacity)
      return false;

    if (
      this.raw_ticket_types.capacity_remaining != undefined &&
      number > this.raw_ticket_types.capacity_remaining
    )
      return false;

    return true;
  }
}
