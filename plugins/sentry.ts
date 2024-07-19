import { ApolloLink } from '@apollo/client/core';
import * as Sentry from '@sentry/browser';
import { SentryLink } from 'apollo-link-sentry';

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig();
  const environment = nuxtApp.$config.ENV as string;
  Sentry.init({
    dsn: runtimeConfig.public.services.sentry.dsn,
    environment,
    sampleRate: 1,
    tracesSampleRate: 1
  });

  const apollo = useApollo();
  apollo.clients!.default.link = ApolloLink.from([
    new SentryLink(),
    apollo.clients!.default.link
  ]);
});
