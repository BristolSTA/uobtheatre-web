import { authService } from "@/services";

export default (context, inject) => {
  inject("auth", () => {
    return {
      isLoggedIn: () => authService.isLoggedIn(context),
      logout: () => authService.logout(context),
      hasPermission: (permission) => {
        return context.store.state.auth.user.permissions.includes(permission);
      },
    };
  });
};
