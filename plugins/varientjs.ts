import { variantJS } from '@variantjs/vue';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(variantJS);
});
