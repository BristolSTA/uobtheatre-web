/**
 * @param {object} context Nuxt Context
 * @returns {any} Middleware Resolver
 */
export default function (context) {
  if (!context.$auth().hasPermission('boxoffice_open')) {
    return context.redirect({
      path: '/',
    });
  }
}
