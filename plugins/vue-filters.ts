import { DateTime } from 'luxon';
import type { Plugin } from '@nuxt/types';
import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    $appName: string;
    dateFormat: Function;
    truncate: Function;
  }
}

const fitlerPlugin: Plugin = (context) => {
  // Constants
  Vue.prototype.$appName = context.$config.application.name;

  // Filters

  Vue.filter('dateFormat', (date: DateTime | string, format: string) => {
    date = date instanceof DateTime ? date : DateTime.fromISO(date);
    return date.toFormat(format);
  });

  Vue.filter('truncate', (text: string, length: number, clamp: string) => {
    clamp = clamp || '...';
    const node = document.createElement('div');
    node.innerHTML = text;
    const content = node.textContent;
    return content && content.length > length
      ? content.slice(0, length) + clamp
      : content;
  });
};

export default fitlerPlugin;
