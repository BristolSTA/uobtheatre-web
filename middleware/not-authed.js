import authService from '@/services/authService';

/**
 * @param {object} context Nuxt Context
 * @returns {any} Middleware Resolver
 */
export default function (context) {
  if (authService.isLoggedIn(context)) {
    return context.redirect({
      path: '/',
    });
  }
}
