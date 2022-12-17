import { library, config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import iconConfig from './font-awesome/fontawesome.config';

// This is important, we are going to let Nuxt worry about the CSS
config.autoAddCss = false;

// Add the icons defined in our config
for (const type in iconConfig) {
  // @ts-ignore
  library.add(...iconConfig[type]);
}

// Add the font-awesome-icon component into nuxt
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon);
});
