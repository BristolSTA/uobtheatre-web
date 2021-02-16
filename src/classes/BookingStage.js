import { auth } from '@/middleware';

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
   * @param {string} name Stage Name
   * @param {any} pageComponent Vue Page Component
   * @param {object} routeOptions Route options and parameters for Vue Router
   * @param {ShouldBeUsedFunction} shouldBeUsed Function to determine whether the stage should be used in the booking process.
   * @param {ShouldBeUsedFunction} eligableFn Function to determine whether the stage is eligable at the moment
   * @param {boolean} requiresPerformance Whether the stage requires the performance to be selected
   */
  constructor(
    name,
    pageComponent,
    routeOptions = {},
    shouldBeUsed = null,
    eligableFn = null,
    requiresPerformance = true
  ) {
    this.name = name;
    this.pageComponent = pageComponent;
    this.routeOptions = routeOptions;
    this.shouldBeUsedFn = shouldBeUsed;
    this.eligableFn = eligableFn;
    this.requiresPerformance = requiresPerformance;
  }

  /**
   * Generates the Vue Router route object for this stage
   *
   * @returns {object} Vue Route Object
   */
  generateRoute() {
    return Object.assign(
      {
        component: this.pageComponent,
        name:
          this.routeOptions.name ?? 'production.book.' + this.routeOptions.path,
        meta: {
          stage: this,
          middleware: [auth],
        },
      },
      this.routeOptions
    );
  }

  /**
   * @returns {string} Stage's Name
   */
  getRouteName() {
    return this.generateRoute().name;
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
