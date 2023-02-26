import useAuthStore from '~~/store/auth';
import useBoxOfficeStore from '~~/store/box-office';

export default defineNuxtRouteMiddleware((to) => {
  const boxOfficeStore = useBoxOfficeStore();
  const authStore = useAuthStore();
  if (!boxOfficeStore.lockdownMode || !authStore.isLoggedIn) return;

  // In lockdown mode, you can only visit box office paths
  if (!to.path.startsWith('/box-office')) return navigateTo('/box-office');
});
