import authService from "@/services/authService";

/**
 * @param {object} context Nuxt Context
 * @returns {any} Middleware Resolver
 */
export default function (context) {
  if (
    !authService.isLoggedIn(context) ||
    !context.$auth().hasPermission("admin_open")
  ) {
    return context.redirect({
      path: "/",
    });
  }
}
