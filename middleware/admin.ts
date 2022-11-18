import { useStore } from '@/store/auth';
export default defineNuxtRouteMiddleware(() => {
  const authStore = useStore();
  if (!authStore.isLoggedIn || !authStore.hasPermission('admin_open')) {
    return navigateTo('/');
  }
});
