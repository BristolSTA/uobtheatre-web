import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import useAuthStore from '@/store/auth';

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();
  if (!authStore.isLoggedIn || !authStore.hasPermission('admin_open')) {
    return navigateTo('/');
  }
});
