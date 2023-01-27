import humanizeDuration from 'humanize-duration';
import { DateTime } from 'luxon';

/**
 * Calculates the duration, in ms, between two date times
 *
 * @param {string} start ISO format start datetime
 * @param {string} end ISO format end datetime
 * @returns {any} Difference between start and end in milliseconds
 */
export const duration = (start: string, end: string) => {
  const startDateTime = DateTime.fromISO(start);
  const endDateTime = DateTime.fromISO(end);
  return endDateTime.diff(startDateTime);
};

/**
 * Generates a readable string for a given duration in minuites
 *
 * @param {number} durationMins number of minuites
 * @returns {string} Formatted readable duration string
 */
export const humanDuration = (
  durationMins: number,
  options?: humanizeDuration.Options
) => {
  const mergedOptions = Object.assign({ round: true, largest: 1 }, options);
  return humanizeDuration(durationMins * 60 * 1000, mergedOptions);
};

/**
 * Generates a readable string the time of day of the passed date
 *
 * @param {DateTime} date number of minuites
 * @returns {string} String of time of day
 */
export const humanDayTime = (date: DateTime) => {
  if (date.hour < 12) {
    return 'Morning';
  }
  if (date.hour < 17) {
    return 'Afternoon';
  }
  return 'Evening';
};

/**
 * Generates a start to end date string given a start and end date
 *
 * @param {string} start ISO format start datetime
 * @param {string} end ISO format end datetime
 * @param {string} format Luxon datetime format string (excluding year)
 * @returns {string} Formatted start to end datetime string
 */
export function displayStartEnd(
  start: string,
  end: string,
  format: string
): string {
  const startDateTime = DateTime.fromISO(start);
  const endDateTime = DateTime.fromISO(end);

  let result = '';
  if (
    startDateTime.month !== endDateTime.month ||
    startDateTime.day !== endDateTime.day
  ) {
    result =
      startDateTime.toFormat(
        startDateTime.year === endDateTime.year ? format : format + ' y'
      ) + ' - ';
  }

  result += `${endDateTime.toFormat(format + ' y')}`;
  return result;
}

export function dateFormat(date: DateTime | string, format: string) {
  date = date instanceof DateTime ? date : DateTime.fromISO(date);
  return date.toFormat(format);
}

export function dateFormatLocale(
  date: DateTime | string,
  format: Intl.DateTimeFormatOptions
) {
  date = date instanceof DateTime ? date : DateTime.fromISO(date);
  return date.toLocaleString(format);
}
