import useAuthStore from '@/store/auth';

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();
  if (!authStore.isLoggedIn || !authStore.hasPermission('finance_reports')) {
    if (authStore.hasPermission('admin_open')) {
      return navigateTo('/administration/');
    } else {
      return navigateTo('/');
    }
  }
});
