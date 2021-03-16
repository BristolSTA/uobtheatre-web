<template>
  <div class="antialiased bg-sta-gray-dark">
    <div
      class="flex flex-col max-w-screen-xl mx-auto lg:container md:items-center md:justify-between md:flex-row"
    >
      <div class="flex flex-row items-center justify-between p-4 text-white">
        <router-link
          class="px-4 text-3xl tracking-tight uppercase sm:text-4xl"
          :to="{ name: 'home' }"
        >
          {{ $appName }}
        </router-link>
        <button
          role="toggle"
          class="rounded-lg md:hidden focus:outline-none focus:shadow-outline"
          @click="open = !open"
          @keypress="open = !open"
        >
          <svg fill="currentColor" viewBox="0 0 20 20" class="w-6 h-6">
            <path
              v-show="!open"
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
              clip-rule="evenodd"
            />
            <path
              v-show="open"
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
      <nav
        :class="{ flex: open, hidden: !open }"
        class="flex-col flex-grow p-4 pt-0 space-y-2 md:space-y-0 md:items-center md:pb-0 md:flex md:justify-end md:flex-row"
      >
        <router-link
          v-for="(item, index) in navItems"
          :key="index"
          :to="item[0]"
          class="block px-4 font-semibold tracking-wide text-white uppercase hover:text-sta-orange-dark"
        >
          {{ item[1] }}
        </router-link>

        <dropdown-nav-item v-if="authService.isLoggedIn()">
          Hi,
          {{
            $store.state.auth.user ? $store.state.auth.user.firstName : 'Guest'
          }}
          <span role="img">👋</span>
          <template v-slot:content>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <dropdown-item
                title="Your Account"
                subtitle="Edit your details"
                icon="user-edit"
                :route="{ name: 'user' }"
              />
              <dropdown-item
                title="Your Bookings"
                subtitle="View bookings and tickets"
                icon="theater-masks"
                :route="{ name: 'user', hash: '#myBookings' }"
              />
            </div>
            <div class="flex md:justify-end">
              <clickable-link
                class="mt-4 rounded-md auth-button btn btn-orange"
                @click="
                  () => {
                    authService.logout();
                    $router.push({ name: 'home' });
                  }
                "
              >
                Log Out
              </clickable-link>
            </div>
          </template>
        </dropdown-nav-item>
        <dropdown-nav-item v-else>
          Hello. Sign in
          <template v-slot:content>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <dropdown-item
                title="Login"
                subtitle="With an exisiting account"
                icon="sign-in-alt"
                :route="{ name: 'login' }"
              />
              <dropdown-item
                title="Register"
                subtitle="Create a new account"
                icon="user-edit"
                :route="{ name: 'signup' }"
              />
            </div>
          </template>
        </dropdown-nav-item>
      </nav>
    </div>
  </div>
</template>

<style lang="scss" scoped>
nav > a.router-link-exact-active {
  @apply text-sta-orange;
}
.auth-button {
  @apply inline-block;
}
</style>

<script>
import ClickableLink from '@/components/ui/ClickableLink.vue';
import { authService } from '@/services';

import DropdownItem from './nav/DropdownItem.vue';
import DropdownNavItem from './nav/DropdownNavItem.vue';

export default {
  components: {
    ClickableLink,
    DropdownNavItem,
    DropdownItem,
  },
  data() {
    return {
      navItems: [
        [{ name: 'productions' }, 'Whats On'],
        [{ name: 'societies' }, 'Societies'],
      ],
      open: false,
      authService: authService,
    };
  },
  watch: {
    $route() {
      this.open = false;
    },
  },
};
</script>
