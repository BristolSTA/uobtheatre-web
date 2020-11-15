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

Vue.filter('truncate', (text, length, clamp) => {
  clamp = clamp || '...';
  var node = document.createElement('div');
  node.innerHTML = text;
  var content = node.textContent;
  return content.length > length ? content.slice(0, length) + clamp : content;
});
