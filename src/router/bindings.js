import { productionService } from '@/services';
import store from '@/store';
import { handle404 } from '@/utils';

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
    next();
  };
  return routeOptions;
}

/**
 * Production Bindings
 */

/**
 * Automatically injectionsd the production prop based on productionSlug
 *
 * @param {object} to Vue Route
 * @param {Function} next Vue Router Closure
 * @returns {Promise} API Service Promise
 */
export function bindProductionSlug(to, next) {
  return productionService
    .fetchProductionBySlug(to.params.productionSlug)
    .then((production) => {
      to.params.production = production;
    })
    .catch((err) => {
      handle404(err, next);
    });
}
