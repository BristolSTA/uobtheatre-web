/* eslint-disable */
import Vue from 'vue';
import VueApollo from 'vue-apollo';
import { createApolloClient } from 'vue-cli-plugin-apollo/graphql-client';
import config from '@/config';
import store from '@/store';

// Name of the localStorage item
const AUTH_TOKEN = config.auth.cookie;

// Http endpoint
const httpEndpoint = config.api.graphql_endpoint;
// Files URL root
export const filesRoot =
  process.env.VUE_APP_FILES_ROOT ||
  httpEndpoint.substr(0, httpEndpoint.indexOf('/graphql'));

Vue.prototype.$filesRoot = filesRoot;

// Config
const defaultOptions = {
  // You can use `https` for secure connection (recommended in production)
  httpEndpoint,
  // You can use `wss` for secure connection (recommended in production)
  // Use `null` to disable subscriptions
  wsEndpoint: null,
  // LocalStorage token
  tokenName: AUTH_TOKEN,
  // Enable Automatic Query persisting with Apollo Engine
  persisting: false,
  // Use websockets for everything (no HTTP)
  // You need to pass a `wsEndpoint` for this to work
  websocketsOnly: false,
  // Is being rendered on the server?
  ssr: false,

  inMemoryCacheOptions: {
    fragmentMatcher: {
      GQLErrorUnion: ['NonFieldError', 'FieldError'],
    },
  },

  // Override the way the Authorization header is set
  getAuth: (tokenName) => {
    if (!store.state.auth.token) return;
    return `JWT ${store.state.auth.token}`;
  },
};

export function createClient(options = {}) {
  return createApolloClient({
    ...defaultOptions,
    ...options,
  });
}

// Call this in the Vue app file
export function createProvider(options = {}) {
  // Create apollo client
  const { apolloClient, wsClient } = createClient(options);
  apolloClient.wsClient = wsClient;

  // Create vue apollo provider
  const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
      $query: {
        // fetchPolicy: 'cache-and-network',
      },
    },
    errorHandler(error) {
      // eslint-disable-next-line no-console
      console.log(
        '%cError',
        'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;',
        error.message
      );
    },
  });

  return apolloProvider;
}
