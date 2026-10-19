import { ApolloLink } from '@apollo/client/core';
import { SentryLink } from 'apollo-link-sentry';

export default defineNuxtPlugin(() => {
  const apollo = useApollo();
  apollo.clients!.default.link = ApolloLink.from([
    new SentryLink(),
    apollo.clients!.default.link
  ]);
});
