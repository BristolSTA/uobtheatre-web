import * as Sentry from '@sentry/browser';

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig();
  const environment = nuxtApp.$config.ENV;
  Sentry.init({
    dsn: runtimeConfig.public.services.sentry.dsn,
    environment,
    sampleRate: 1,
    tracesSampleRate: 1
  });

  nuxtApp.hook('apollo:error', (error) => {
    Sentry.captureException(error);
  });
});
