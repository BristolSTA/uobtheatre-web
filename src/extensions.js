// Use this file for extending any libraries, where the effect is also needed in testing
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import {
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faCircleNotch,
  faClock,
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
  faChevronUp,
  faChevronDown,
  faTicketAlt,
  faClock,
  faFacebook,
  faCircleNotch
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
