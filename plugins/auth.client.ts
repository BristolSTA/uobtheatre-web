import { defineNuxtPlugin } from '#app';
import useAuthStore from '~~/store/auth';
import useBoxOfficeStore from '~~/store/box-office';

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();
  const boxOfficeStore = useBoxOfficeStore();

  // Attempt a silent refresh on load
  await authStore.refreshUsingToken();

  // Reload box office
  boxOfficeStore.rememberState();

  // Listen for log-off via another tab
  window.addEventListener('storage', (event) => {
    if (event.key === 'logout' && authStore.isLoggedIn) {
      authStore.logout(false);
      const route = useRoute();
      const router = useRouter();
      if (route.path !== '/') {
        router.push('/');
      }
    }
  });
});
