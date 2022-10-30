import { createApolloProvider } from '@vue/apollo-option';

/**
 * This plugin is needed in the midpoint between transition from the Options API to the Composition API.
 * Nuxt Apollo (v5) currently only implements the vue apollo composable implemntation, meaining that for the options API smart queries do not work.
 * This file installs the option provider too.
 */

export default defineNuxtPlugin((nuxtApp) => {
  const apolloProvider = createApolloProvider({
    defaultClient: useApolloClient().client
  });
  nuxtApp.vueApp.use(apolloProvider);
});
