export default class {
  constructor(raw_ticket_types) {
    this.raw_ticket_types = raw_ticket_types;
  }

  get ticket_options() {
    return this.raw_ticket_types.ticket_types;
  }

  get performance_capacity_remaining() {
    return this.raw_ticket_types.capacity_remaining;
  }

  set performance_capacity_remaining(number) {
    return (this.raw_ticket_types.capacity_remaining = number);
  }

  decrementPerformanceCapacity() {
    this.performance_capacity_remaining--;
  }

  incrementPerformanceCapacity() {
    this.performance_capacity_remaining++;
  }

  /**
   * @param {number} seat_group_id Seat group to check against
   * @returns {number} Capacity remaining
   */
  capacityRemainingForSeatGroup(seat_group_id) {
    return this.ticket_options.find(
      (option) => option.seat_group.id === seat_group_id
    ).seat_group.capacity_remaining;
  }

  /**
   * @param {number} seat_group_id Seat group ID to decrease capacity by 1
   */
  decrementSeatGroupCapacity(seat_group_id) {
    this.ticket_options.find((option) => option.seat_group.id === seat_group_id)
      .seat_group.capacity_remaining--;
  }

  /**
   * @param {number} seat_group_id Seat group ID to increase capacity by 1
   */
  incrementSeatGroupCapacity(seat_group_id) {
    this.ticket_options.find((option) => option.seat_group.id === seat_group_id)
      .seat_group.capacity_remaining++;
  }

  /**
   * @param {number} number Number of tickets requested to book
   * @param {?number} seat_group_id Optional seat group id to also check it has enough capacity
   * @returns {boolean} Whether tickets can be added
   */
  canAddTickets(number, seat_group_id = null) {
    // 1st check if performance can have this many tickets added
    if (number > this.performance_capacity_remaining) return false;

    // 2nd, if has a seat_group, check that has enough remaining capacity
    if (seat_group_id != null) {
      let seat_group_capacity = this.capacityRemainingForSeatGroup(
        seat_group_id
      );
      if (number > seat_group_capacity) return false;
    }

    return true;
  }
}
