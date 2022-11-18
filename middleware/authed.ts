import { useStore } from '@/store/auth';

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useStore();
  if (!authStore.isLoggedIn) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  }
});
