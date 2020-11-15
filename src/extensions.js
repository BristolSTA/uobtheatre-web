// Use this file for extending any libraries, where the effect is also needed in testing
import Vue from 'vue';
import { DateTime } from 'luxon';

/**
 * Vue extensions
 */

Vue.filter('dateFormat', (date, format) => {
  return DateTime.fromISO(date).toFormat(format);
});
