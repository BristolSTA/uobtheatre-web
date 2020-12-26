import authService from '../services/authService';

/**
 * @param {object} root0 Root Parameters Object
 * @param {any} root0.next Next Middleware Resolver
 * @param {any} root0.to Incoming Route
 * @returns {any} Middleware Resolver
 */
export default function auth({ next, to }) {
  if (!authService.isLoggedIn()) {
    return next({ name: 'login', query: { redirect: to.fullPath } });
  }

  return next();
}
