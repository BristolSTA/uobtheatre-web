/**
 * @param {object} context Nuxt Context
 * @returns {any} Middleware Resolver
 */
export default function (context) {
  if (!context.store.state.auth.user.canBoxoffice) {
    return context.redirect({
      path: '/',
    })
  }
}
