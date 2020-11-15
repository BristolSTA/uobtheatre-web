// Use this file for extending any libraries, where the effect is also needed in testing
import Vue from 'vue';
import { DateTime } from 'luxon';

/**
 * Vue extensions
 */

// Constants

Vue.prototype.$appName = process.env.VUE_APP_NAME;

// Filters

Vue.filter('dateFormat', (date, format) => {
  return DateTime.fromISO(date).toFormat(format);
});
