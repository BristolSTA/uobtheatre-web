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
    tracesSampleRate: 1,
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: {
        request: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] },
        response: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] }
      },
      httpBodies: [],
      urlQueryParams: {
        deny: ['forwarded', '-ip', 'remote-', 'via', '-user']
      },
      genAI: { inputs: false, outputs: false },
      databaseQueryData: false,
      graphQL: { document: false, variables: false }
    }
  });

  const apollo = useApollo();
  apollo.clients!.default.link = ApolloLink.from([
    new SentryLink(),
    apollo.clients!.default.link
  ]);
});
