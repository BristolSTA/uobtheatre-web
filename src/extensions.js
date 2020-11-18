// Use this file for extending any libraries, where the effect is also needed in testing
import { DateTime } from 'luxon';
import { createApp } from 'vue';

module.exports = (options) => {
  let app = createApp(options);

  /**
   * Vue extensions
   */

  // Constants
  app.config.globalProperties.$appName = process.env.VUE_APP_NAME;

  // Filters
  app.config.globalProperties.$filters = {
    dateFormat(date, format) {
      return DateTime.fromISO(date).toFormat(format);
    },
    truncate(text, length, clamp) {
      clamp = clamp || '...';
      var node = document.createElement('div');
      node.innerHTML = text;
      var content = node.textContent;
      return content.length > length
        ? content.slice(0, length) + clamp
        : content;
    },
  };

  return app;
};
