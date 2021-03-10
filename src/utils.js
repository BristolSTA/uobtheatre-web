import { DateTime } from 'luxon';
import Swal from 'sweetalert2';
import resolveConfig from 'tailwindcss/resolveConfig';

import Errors from '@/classes/Errors';
import store from '@/store';

/**
 * Joins a list together with commas, but uses "and" for the final pair
 * e.g. The Winston Theatre, The Pegg Theatre and The Anson Rooms
 *
 * @param {Array<string>} array List of strings to join
 * @returns {string} Joined string
 */
let joinWithAnd = (array) => {
  return array.join(', ').replace(/, ([^,]*)$/, ' and $1');
};

/**
 * Calculates the duration, in ms, between two date times
 *
 * @param {string} start ISO format start datetime
 * @param {string} end ISO format end datetime
 * @returns {any} Difference between start and end in milliseconds
 */
let duration = (start, end) => {
  start = DateTime.fromISO(start);
  end = DateTime.fromISO(end);
  return end.diff(start);
};

/**
 * Generates a start to end date string given a start and end date
 *
 * @param {string} start ISO format start datetime
 * @param {string} end ISO format end datetime
 * @param {string} format Luxon datetime format string (excluding year)
 * @returns {string} Formatted start to end datetime string
 */
let displayStartEnd = (start, end, format) => {
  start = DateTime.fromISO(start);
  end = DateTime.fromISO(end);

  let result = '';
  if (start.month != end.month || start.day != end.day) {
    result =
      start.toFormat(start.year == end.year ? format : format + ' y') + ' - ';
  }

  result += `${end.toFormat(format + ' y')}`;
  return result;
};

/**
 * Handles setting the Vuex global loading state on / off based on a promise
 *
 * @param {Promise|Promise[]} promises The promise(s) to use to dictate when loading has finished
 * @returns {Promise} The original promise
 */
let runPromiseWithLoading = async (promises) => {
  store.commit('SET_LOADING');
  if (!(promises instanceof Array)) {
    promises = [promises];
  }
  await Promise.all(promises);
  store.commit('SET_NOT_LOADING');
};

/**
 * Merged Tailwind Config Object
 */
let tailwindConfig = resolveConfig(require('../tailwind.config'));

let errorHandler = (e) => {
  // TODO: Implement sentry here
  console.error(e);
  apiErrorToast.fire();
};

let performMutation = (apollo, options, mutationName) => {
  return new Promise((resolve, reject) => {
    apollo.mutate(options).then(({ data }) => {
      if (!data[mutationName].success)
        return reject(Errors.createFromAPI(data[mutationName].errors));
      resolve(data);
    });
  });
};

/**
 * Default branded Sweetalert instances
 */

let swal = Swal.mixin({
  background: tailwindConfig.theme.colors['sta-gray'].DEFAULT,
  customClass: {
    title: 'text-white',
    content: 'text-white',
  },
  confirmButtonColor: tailwindConfig.theme.colors['sta-orange'].DEFAULT,
  denyButtonColor: tailwindConfig.theme.colors['sta-rouge'].DEFAULT,
});
let swalToast = swal.mixin({
  toast: true,
  showConfirmButton: false,
});
let apiErrorToast = swalToast.mixin({
  icon: 'error',
  title: 'There was a server error while executing your request',
  showConfirmButton: false,
  position: 'bottom-end',
  timerProgressBar: true,
  timer: 4000,
});

export {
  apiErrorToast,
  displayStartEnd,
  duration,
  errorHandler,
  joinWithAnd,
  performMutation,
  runPromiseWithLoading,
  swal,
  swalToast,
  tailwindConfig,
};
