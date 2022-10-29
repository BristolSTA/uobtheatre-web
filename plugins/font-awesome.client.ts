import { library, config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import iconConfig from './font-awesome/fontawesome.config';

// This is important, we are going to let Nuxt worry about the CSS
config.autoAddCss = false;

// You can add your icons directly in this plugin. See other examples for how you
// can add other styles or just individual icons.
library.add(fas);

export default defineNuxtPlugin((nuxtApp) => {
  for (const type in iconConfig) {
    library.add(...iconConfig[type]);
  }
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon);
});
