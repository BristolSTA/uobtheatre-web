export default class {
  /**
   * ShouldBeUsedFunction
   *
   * @name ShouldBeUsedFunction
   * @param {object} production Production Data Object
   * @param {object|null} booking Booking Data Object
   */

  /**
   * Constructs a booking stage
   *
   * @param {Object} stageInfo
   */
  constructor({
    name,
    routeName,
    shouldBeUsed = null,
    eligable = null,
    requiresPerformance = true,
  }) {
    this.name = name;
    this.routeName = routeName;
    this.shouldBeUsedFn = shouldBeUsed;
    this.eligableFn = eligable;
    this.requiresPerformance = requiresPerformance;
  }

  /**
   * @param {object} production Production Data Object
   * @param {object|null} booking Booking Data Object
   * @returns {boolean} Whether the stage should be used in the booking process
   */
  shouldBeUsed(production, booking = null) {
    return this.shouldBeUsedFn
      ? this.shouldBeUsedFn(production, booking)
      : true;
  }

  /**
   * @param {object} production Production Data Object
   * @param {object|null} booking Booking Data Object
   * @returns {boolean} Whether the stage can be naviagated to
   */
  eligable(production, booking = null) {
    return (
      (this.eligableFn ? this.eligableFn(production, booking) : true) &&
      !(this.requiresPerformance && !booking.performance)
    );
  }
}
