// Use this file for extending any libraries, where the effect is also needed in testing
import Vue from 'vue';
import { DateTime } from 'luxon';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faTicketAlt,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

/**
 * Import FontAwesome
 */

library.add(faChevronLeft, faChevronRight, faTicketAlt, faClock, faFacebook);
Vue.component('font-awesome-icon', FontAwesomeIcon);

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

Vue.mixin({
  methods: {
    runPromiseWithLoading(promise) {
      this.$store.commit('SET_LOADING');
      return promise.then(() => {
        this.$store.commit('SET_NOT_LOADING');
      });
    },
  },
});
