export default class {
  constructor(rawPerformance) {
    this.raw_ticket_options = JSON.parse(
      JSON.stringify(rawPerformance.ticketOptions)
    );
    this._performanceCapacityRemaining = rawPerformance.capacityRemaining;
    this.raw_discounts = rawPerformance.discounts;
  }

  get discounts() {
    return this.raw_discounts;
  }

  get ticketOptions() {
    return this.raw_ticket_options;
  }

  get performanceCapacityRemaining() {
    return this._performanceCapacityRemaining;
  }

  set performanceCapacityRemaining(number) {
    return (this._performanceCapacityRemaining = number);
  }

  decrementPerformanceCapacity() {
    this.performanceCapacityRemaining--;
  }

  incrementPerformanceCapacity() {
    this.performanceCapacityRemaining++;
  }

  /**
   * @param {number} seatGroupId Seat group to check against
   * @returns {number} Capacity remaining
   */
  capacityRemainingForSeatGroup(seatGroupId) {
    return Math.min(
      this.ticketOptions.find((option) => option.seatGroup.id === seatGroupId)
        .capacityRemaining,
      this.performanceCapacityRemaining
    );
  }

  /**
   * @param {number} seatGroupId Seat group ID to decrease capacity by 1
   */
  decrementSeatGroupCapacity(seatGroupId) {
    const index = this.ticketOptions.findIndex(
      (option) => option.seatGroup.id === seatGroupId
    );
    this.raw_ticket_options[index].capacityRemaining =
      this.raw_ticket_options[index].capacityRemaining - 1;
  }

  /**
   * @param {string} seatGroupId Seat group ID to increase capacity by 1
   */
  incrementSeatGroupCapacity(seatGroupId) {
    const index = this.ticketOptions.findIndex(
      (option) => option.seatGroup.id === seatGroupId
    );

    this.raw_ticket_options[index].capacityRemaining =
      this.raw_ticket_options[index].capacityRemaining + 1;
  }

  /**
   * @param {number} number Number of tickets requested to book
   * @param {?number} seatGroupId Optional seat group id to also check it has enough capacity
   * @returns {boolean} Whether tickets can be added
   */
  canAddTickets(number, seatGroupId = null) {
    // 1st check if performance can have this many tickets added
    if (number > this.performanceCapacityRemaining) {
      return false;
    }

    // 2nd, if has a seat_group, check that has enough remaining capacity
    if (seatGroupId != null) {
      const seatGroupCapacity = this.capacityRemainingForSeatGroup(seatGroupId);
      if (number > seatGroupCapacity) {
        return false;
      }
    }

    return true;
  }
}
