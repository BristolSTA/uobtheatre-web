import { useStore } from '@/store/auth';

export default defineNuxtRouteMiddleware(() => {
  const authStore = useStore();
  if (!authStore.isLoggedIn) {
    return navigateTo({
      path: '/login',
      query: { redirect: context.route.fullPath }
    });
  }
});
