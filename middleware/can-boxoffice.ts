import useAuthStore from '@/store/auth';

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();
  if (!authStore.hasPermission('boxoffice_open')) {
    return navigateTo('/');
  }
});
