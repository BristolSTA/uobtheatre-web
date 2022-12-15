import useAuthStore from '@/store/auth';
import { defineNuxtRouteMiddleware, navigateTo } from '#app';
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  if (!authStore.isLoggedIn) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  }
});
