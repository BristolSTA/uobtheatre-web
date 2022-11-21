import useAuthStore from '@/store/auth';
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  if (!authStore.isLoggedIn) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  }
});
