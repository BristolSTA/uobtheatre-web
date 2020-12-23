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
   */
  constructor(name, pageComponent, routeOptions = {}, shouldBeUsed = null) {
    this.name = name;
    this.pageComponent = pageComponent;
    this.routeOptions = routeOptions;
    this.shouldBeUsedFn = shouldBeUsed;
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
}
