export default defineNuxtRouteMiddleware(() => {
  const authStore = useStore();
  if (!authStore.hasPermission('boxoffice_open')) {
    return navigateTo('/');
  }
});
