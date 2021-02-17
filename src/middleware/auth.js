import authService from '../services/authService';

/**
 * @param {object} routerContext Vue Router Context
 * @param {any} routerContext.next Next Middleware Resolver
 * @param {any} routerContext.to Incoming Route
 * @returns {any} Middleware Resolver
 */
export default function auth({ next, to }) {
  if (!authService.isLoggedIn()) {
    return next({ name: 'login', query: { redirect: to.fullPath } });
  }

  return next();
}
