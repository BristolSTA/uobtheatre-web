// Use this file for extending any libraries, where the effect is also needed in testing
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import {
  faChevronLeft,
  faChevronRight,
  faCircleNotch,
  faClock,
  faMapMarkedAlt,
  faTicketAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { DateTime } from 'luxon';
import Vue from 'vue';

import config from '@/config';

/**
 * Import FontAwesome
 */

library.add(
  faChevronLeft,
  faChevronRight,
  faTicketAlt,
  faClock,
  faFacebook,
  faCircleNotch,
  faMapMarkedAlt
);
Vue.component('font-awesome-icon', FontAwesomeIcon);

/**
 * Vue extensions
 */

// Constants

Vue.prototype.$appName = config.application.name;

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
