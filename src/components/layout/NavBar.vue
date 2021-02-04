<template>
  <nav class="px-1 py-6 sm:p-6 bg-sta-gray-dark">
    <div class="container flex flex-wrap items-center justify-between">
      <div class="flex items-center flex-shrink-0 mr-2 text-white">
        <router-link :to="{ name: 'home' }">
          <span
            class="text-3xl tracking-tight text-white uppercase sm:text-4xl"
          >
            {{ $appName }}
          </span>
        </router-link>
      </div>
      <div class="block lg:hidden">
        <button
          class="px-3 py-2 text-white border rounded border-sta-orange"
          role="toggle"
          @click="navHidden = !navHidden"
          @keydown="
            (e) => {
              e.target.click();
            }
          "
        >
          <svg
            class="w-6 h-6 fill-current"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div
        ref="collapsable-navbar"
        class="w-full lg:flex lg:items-center lg:w-auto"
        :class="navHidden ? 'hidden' : 'block'"
      >
        <div class="lg:flex-grow">
          <router-link
            v-for="(item, index) in navItems"
            :key="index"
            :to="item[0]"
            class="block mt-4 mr-6 font-semibold tracking-wide text-white uppercase lg:inline-block lg:mt-0 hover:text-sta-orange"
          >
            {{ item[1] }}
          </router-link>
          <router-link
            v-if="!authService.isLoggedIn()"
            :to="{ name: 'login' }"
            class="mt-4 auth-button btn btn-orange btn-outline lg:mt-0"
          >
            Login
          </router-link>
          <clickable-link
            v-else
            class="mt-4 auth-button btn btn-orange btn-outline lg:mt-0"
            @click="authService.logout()"
          >
            Log Out
          </clickable-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
nav .router-link-exact-active {
  @apply text-sta-orange;
}
.auth-button {
  @apply inline-block;
}
</style>

<script>
import ClickableLink from '@/components/ui/ClickableLink.vue';
import { authService } from '@/services';

export default {
  components: {
    ClickableLink,
  },
  data() {
    return {
      navItems: [
        ['/', 'Events'],
        ['/', 'Societies'],
        ['/', 'Venues'],
        ['/', 'Contact'],
      ],
      navHidden: true,
      authService: authService,
    };
  },
};
</script>
