import VueGtag from 'vue-gtag';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  // Install VueGtag into the Vue app
  nuxtApp.vueApp.use(
    VueGtag,
    {
      config: { id: config.public.services.googleAnalytics.id }
    },
    useRouter()
  );
});
