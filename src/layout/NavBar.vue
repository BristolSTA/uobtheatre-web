<template>
  <nav class="p-6 bg-sta-gray-dark">
    <div class="container flex flex-wrap items-center justify-between">
      <div class="flex items-center flex-shrink-0 mr-10 text-white">
        <router-link :to="{ name: 'home' }"
          ><span class="text-4xl tracking-tight uppercase">{{
            $appName
          }}</span></router-link
        >
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
        ref="collapsableNavbar"
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
          <template v-if="!isLoggedIn">
            <router-link
              to="/login"
              class="inline-block mt-4 btn btn-orange btn-outline lg:mt-0"
            >
              Login
            </router-link>
          </template>
          <form v-else @submit.prevent="logOut">
            <button
              href="/login"
              type="submit"
              class="inline-block mt-4 btn btn-orange btn-outline lg:mt-0"
            >
              Log Out
            </button>
          </form>
        </div>
      </div>
    </div>
  </nav>
</template>

<style lang="postcss" scoped>
nav .router-link-exact-active {
  color: @apply bg-sta-orange;
}
</style>

<script>
import { authService } from '@/services';

export default {
  data() {
    return {
      navItems: [
        ['/', 'Events'],
        ['/', 'Societies'],
        ['/', 'Venues'],
        ['/', 'Contact'],
      ],
      navHidden: true,
    };
  },
  computed: {
    isLoggedIn() {
      return authService.isLoggedIn();
    },
  },
  methods: {
    logOut() {
      authService.logout();
    },
  },
};
</script>
