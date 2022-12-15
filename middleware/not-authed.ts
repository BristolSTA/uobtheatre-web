import useAuthStore from '@/store/auth';
import { defineNuxtRouteMiddleware, navigateTo } from '#app';
export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();
  if (authStore.isLoggedIn) {
    return navigateTo('/');
  }
});
