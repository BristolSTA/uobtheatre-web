import { authService } from "@/services";

export default async (context) => {
  // Init auth process
  await authService.silentRefresh(context);
  window.addEventListener("storage", (event) => {
    if (event.key === "logout" && authService.isLoggedIn(context)) {
      authService.logout(context, false);
      if (context.route.path !== "/") {
        context.redirect("/");
      }
    }
  });

  // Init box office store
  context.store.dispatch("box-office/rememberState");
};
