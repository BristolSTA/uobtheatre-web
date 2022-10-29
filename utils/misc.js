import { DateTime } from 'luxon';
import humanizeDuration from 'humanize-duration';
import * as Sentry from '@sentry/browser';
import ValidationError from '@/errors/ValidationError';

import Errors from '@/classes/Errors';

/**
 * Joins a list together with commas, but uses "and" for the final pair
 * e.g. The Winston Theatre, The Pegg Theatre and The Anson Rooms
 *
 * @param {Array<string>} array List of strings to join
 * @returns {string} Joined string
 */
const joinWithAnd = (array) => {
  return array.join(', ').replace(/, ([^,]*)$/, ' and $1');
};

/**
 * Calculates the duration, in ms, between two date times
 *
 * @param {string} start ISO format start datetime
 * @param {string} end ISO format end datetime
 * @returns {any} Difference between start and end in milliseconds
 */
const duration = (start, end) => {
  start = DateTime.fromISO(start);
  end = DateTime.fromISO(end);
  return end.diff(start);
};

/**
 * Generates a readable string for a given duration in minuites
 *
 * @param {number} durationMins number of minuites
 * @returns {string} Formatted readable duration string
 */
const humanDuration = (durationMins, options) => {
  const mergedOptions = Object.assign({ round: true, largest: 1 }, options);
  return humanizeDuration(durationMins * 60 * 1000, mergedOptions);
};

/**
 * Generates a readable string the time of day of the passed date
 *
 * @param {DateTime} date number of minuites
 * @returns {string} String of time of day
 */
const humanDayTime = (date) => {
  if (date.hour < 12) {
    return 'Morning';
  }
  if (date.hour < 17) {
    return 'Afternoon';
  }
  return 'Evening';
};

const errorHandler = (e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  apiErrorToast.fire();
  Sentry.captureException(e);
};

const silentErrorHandler = (e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  Sentry.captureException(e);
};

const performMutation = (apollo, options, mutationName) => {
  return new Promise((resolve, reject) => {
    apollo
      .mutate(options)
      .then(({ data }) => {
        if (!data[mutationName].success) {
          return reject(
            new ValidationError(Errors.createFromAPI(data[mutationName].errors))
          );
        }
        resolve(data);
      })
      .catch((e) => {
        errorHandler(e);
        reject(e);
      });
  });
};

const isInViewport = function (elem) {
  const bounding = elem.getBoundingClientRect();
  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <=
      (window.innerWidth || document.documentElement.clientWidth)
  );
};

export {
  apiErrorToast,
  errorToast,
  successToast,
  displayStartEnd,
  humanDuration,
  duration,
  errorHandler,
  silentErrorHandler,
  joinWithAnd,
  performMutation,
  loadingSwal,
  swal,
  swalToast,
  humanDayTime,
  tailwindConfig,
  catchOnly,
  getValidationErrors,
  isInViewport
};
