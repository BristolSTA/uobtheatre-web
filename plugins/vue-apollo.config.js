import { createApolloClient } from "vue-cli-plugin-apollo/graphql-client";
import VueApollo from "vue-apollo";
import * as Sentry from "@sentry/browser";
import authService from "@/services/authService";

// Config
const defaultOptions = {
  // You can use `wss` for secure connection (recommended in production)
  // Use `null` to disable subscriptions
  wsEndpoint: null,
  // Enable Automatic Query persisting with Apollo Engine
  persisting: false,
  // Cache Options
  inMemoryCacheOptions: {
    fragmentMatcher: {
      GQLErrorUnion: ["NonFieldError", "FieldError"],
    },
  },
};

export default (context) => {
  return {
    ...defaultOptions,
    httpEndpoint: context.$config.api.graphql_endpoint,
    authenticationType: "JWT",
    getAuth: () => {
      if (authService.currentAuthToken(context)) {
        return `JWT ${authService.currentAuthToken(context)}`;
      }
    },
  };
};

export function createClient(options = {}) {
  return createApolloClient({
    ...defaultOptions,
    ...options,
  });
}

export function createProvider(clientOptions = {}, vueApolloOptions = {}) {
  // Create apollo client
  const { apolloClient, wsClient } = createClient(clientOptions);
  apolloClient.wsClient = wsClient;

  // Create vue apollo provider
  const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: vueApolloOptions,
    errorHandler(error) {
      // eslint-disable-next-line no-console
      console.log(
        "%cError",
        "background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;",
        error.message
      );
      Sentry.captureException(error);
    },
  });

  return apolloProvider;
}
