import gql from 'graphql-tag';

import ProductionFragment from '@/graphql/fragments/ProductionFragment.gql';
import store from '@/store';
import { createClient } from '@/vue-apollo';

/**
 * @param {object} routeOptions Route Options
 * @param {Array} bindings List of route bindings
 * @returns {object} Vue Route Definition
 */
export function routeWithBindings(routeOptions, bindings) {
  routeOptions.props = true;
  routeOptions.beforeEnter = async (to, from, next) => {
    store.commit('SET_LOADING');
    for (const binding of bindings) {
      await binding(to, next);
    }
    store.commit('SET_NOT_LOADING');
    return next();
  };
  return routeOptions;
}

/**
 * Production Bindings
 */

/**
 * Automatically injects the production prop based on productionSlug
 *
 * @param {any} query Optional GraphQL query to override default
 * @returns {Promise} API Service Promise
 */
export function bindProductionSlug(query = null) {
  return (to, next) => {
    // Load query
    if (!query) {
      query = gql`
        query production($slug: String!) {
          production(slug: $slug) {
            ...ProductionBasicInfo
          }
        }
        ${ProductionFragment}
      `;
    }

    let { apolloClient } = createClient();

    // Execute query
    return apolloClient
      .query({
        query: query,
        variables: {
          slug: to.params.productionSlug,
        },
      })
      .then((result) => {
        let production = result.data.production;
        if (!production) return next({ name: '404' });
        to.params.production = production;
      });
  };
}
