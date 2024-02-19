// Performance:
// id (String),
// venue (Venue),
// disabled (bool),
// description (String),
// doorsOpen (time),
// start (time),
// end (time),
// durationMins(int),
// soldOut (bool),
// isInperson(bool),
// isBookable(bool)

import { DateTime } from 'luxon';
import { IdInput } from '~~/types/generic';
import {
  PerformanceFragmentFragment,
  VenueNode
} from '~~/graphql/codegen/operations';
import Venue from './Venue';

export default class Performance {
  id?: IdInput;
  venue?: Partial<Pick<VenueNode, 'id' | 'name' | 'slug'>>;
  disabled?: boolean;
  description?: String;
  doorsOpen?: DateTime;
  start?: DateTime;
  end?: DateTime;
  durationMins?: number;
  soldOut?: boolean;
  isInperson?: boolean;
  isBookable?: boolean;

  /**
   * Creates a performance object from an API response
   *
   * @param {object} performanceData API Performance Data
   * @returns {Performance} A Performance Instance
   * @static
   */

  static fromAPIData(performanceData: PerformanceFragmentFragment) {
    const booking = new this();
    booking.updateFromAPIData(performanceData);
    return booking;
  }

  /**
   * Updates the Performance object from an API response
   *
   * @param {object} performanceData API Performance Data
   */
  updateFromAPIData(performanceData: PerformanceFragmentFragment) {
    // id (String),
    this.id = performanceData.id;

    // venue (Venue),

    // disabled (bool),
    this.disabled = performanceData.disabled;

    // description (String),
    if (performanceData.description) {
      this.description = performanceData.description;
    }

    // doorsOpen (time),
    if (performanceData.doorsOpen) {
      this.doorsOpen = performanceData.doorsOpen;
    }

    // start (time),
    if (performanceData.start) {
      this.start = performanceData.start;
    }

    // end (time),
    if (performanceData.end) {
      this.end = performanceData.end;
    }

    // durationMins(int),
    if (performanceData.durationMins) {
      this.durationMins = performanceData.durationMins;
    }

    // soldOut (bool),
    if (performanceData.soldOut) {
      this.soldOut = performanceData.soldOut;
    }

    // isInperson(bool),
    if (performanceData.isInperson) {
      this.isInperson = performanceData.isInperson;
    }

    // isBookable(bool)
    if (performanceData.isBookable) {
      this.isBookable = performanceData.isBookable;
    }

    // Venue:
    // id (String),
    // name (String),
    // slug (String)
    if (performanceData.venue) {
      this.venue = new Venue(
        performanceData.venue.id,
        performanceData.venue.name,
        performanceData.venue.slug
      );
    }
  }
}
