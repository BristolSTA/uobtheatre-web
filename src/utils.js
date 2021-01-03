import { DateTime } from 'luxon';

import store from '@/store';

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

let handle404 = (err, next) => {
  if (err.response && err.response.status == 404) {
    next({ name: '404' });
  }
};
let handle404Mixin = {
  methods: {
    /**
     * Checks if the API response is a 404, and if it is, redirects the user to the 404 page
     *
     * @param {any} err Axios error response object
     */

    handle404(err) {
      handle404(err, this.$router.push);
    },
  },
};

export {
  displayStartEnd,
  duration,
  handle404,
  handle404Mixin,
  joinWithAnd,
  runPromiseWithLoading,
};
