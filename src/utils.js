import { DateTime } from 'luxon';

import store from './store';

let joinWithAnd = (array) => {
  return array.join(', ').replace(/, ([^,]*)$/, ' and $1');
};

let duration = (start, end) => {
  start = DateTime.fromISO(start);
  end = DateTime.fromISO(end);
  return end.diff(start);
};

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
 * @param {Promise} promise The promise to use to dictate when loading has finished
 * @returns {Promise} The original promise
 */
let runPromiseWithLoading = (promise) => {
  store.commit('SET_LOADING');
  return promise.then(() => {
    store.commit('SET_NOT_LOADING');
  });
};

let handle404Mixin = {
  methods: {
    /**
     * Checks if the API response is a 404, and if it is, redirects the user to the 404 page
     *
     * @param {any} err Axios error response object
     */
    handle404(err) {
      if (err.response && err.response.status == 404) {
        this.$router.push({ name: '404' });
      }
    },

    check404(objectToCheck) {
      if (objectToCheck == null) {
        this.$router.push({ name: '404' });
      }
    },
  },
};

export {
  displayStartEnd,
  duration,
  handle404Mixin,
  joinWithAnd,
  runPromiseWithLoading,
};
