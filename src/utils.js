import { DateTime } from 'luxon';
import Swal from 'sweetalert2';
import resolveConfig from 'tailwindcss/resolveConfig';

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

let tailwindConfig = resolveConfig(require('../tailwind.config'));
let swal = Swal.mixin({
  background: tailwindConfig.theme.colors['sta-gray'].DEFAULT,
  customClass: {
    title: 'text-white',
    content: 'text-white',
  },
  confirmButtonColor: tailwindConfig.theme.colors['sta-orange'].DEFAULT,
  denyButtonColor: tailwindConfig.theme.colors['sta-rouge'].DEFAULT,
});

export {
  displayStartEnd,
  duration,
  joinWithAnd,
  runPromiseWithLoading,
  swal,
  tailwindConfig,
};
