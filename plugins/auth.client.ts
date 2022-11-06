import { useStore } from '~~/store/auth';

export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useStore();

  // Define how Apollo should get the token
  // nuxtApp.hook('apollo:auth', ({ token }) => {
  //   token.value = authStore.token;
  // });

  // Attempt a silent refresh on load
  authStore.refreshUsingToken();

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
