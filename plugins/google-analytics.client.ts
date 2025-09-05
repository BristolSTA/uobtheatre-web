import { configure } from 'vue-gtag';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  // Install VueGtag into the Vue app
  configure({
    tagId: config.public.services.googleAnalytics.id
  });
});
