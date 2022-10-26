<template>
  <div class="antialiased bg-sta-gray-dark">
    <div
      class="flex flex-col mx-auto max-w-screen-xl md:flex-row md:items-center md:justify-between lg:container"
    >
      <div class="flex flex-row items-center justify-between p-4 text-white">
        <NuxtLink
          class="px-4 text-3xl tracking-tight uppercase sm:text-4xl"
          to="/"
        >
          {{ $appName }}
        </NuxtLink>
        <button
          role="toggle"
          class="focus:shadow-outline rounded-lg focus:outline-none md:hidden"
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
        class="flex-col flex-grow p-4 pt-0 space-y-2 md:flex md:flex-row md:items-center md:justify-end md:pb-0 md:space-y-0"
      >
        <NuxtLink
          v-for="(item, index) in navItems"
          :key="index"
          :to="item[0]"
          class="block px-4 hover:text-sta-orange-dark text-white font-semibold tracking-wide uppercase"
        >
          {{ item[1] }}
        </NuxtLink>
        <dropdown-nav-item v-if="$store.state.auth.user" ref="user-dropdown">
          Hi, {{ $store.state.auth.user.firstName }}
          <span role="img">👋</span>
          <template #content>
            <div class="grid gap-4 grid-cols-1 md:grid-cols-2">
              <dropdown-item
                v-if="$auth().hasPermission('admin_open')"
                title="Admin"
                subtitle="Control productions and other tools"
                icon="user-shield"
                route="/administration"
                @click="closeUserMenu"
              />
              <dropdown-item
                v-if="$auth().hasPermission('boxoffice_open')"
                title="Box Office"
                subtitle="Check in and sell tickets"
                icon="ticket-alt"
                route="/box-office"
                @click="closeUserMenu"
              />
              <dropdown-item
                title="Your Account"
                subtitle="Edit your details"
                icon="user-edit"
                route="/user"
                @click="closeUserMenu"
              />
              <dropdown-item
                title="Your Bookings"
                subtitle="View bookings and tickets"
                icon="theater-masks"
                :route="{ path: '/user', hash: '#myBookings' }"
                @click="closeUserMenu"
              />
            </div>
            <div class="flex md:justify-end">
              <clickable-link
                class="auth-button btn btn-orange mt-4 rounded-md"
                @click="onLogout"
              >
                Log Out
              </clickable-link>
            </div>
          </template>
        </dropdown-nav-item>
        <dropdown-nav-item v-else>
          Hello. Sign in
          <template #content>
            <div class="grid gap-4 grid-cols-1 md:grid-cols-2">
              <dropdown-item
                title="Login"
                subtitle="With an exisiting account"
                icon="sign-in-alt"
                route="/login"
                @click="closeUserMenu"
              />
              <dropdown-item
                title="Register"
                subtitle="Create a new account"
                icon="user-edit"
                route="/signup"
                @click="closeUserMenu"
              />
            </div>
          </template>
        </dropdown-nav-item>
      </nav>
    </div>
  </div>
</template>

<script>
import DropdownItem from './DropdownItem.vue';
import DropdownNavItem from './DropdownNavItem.vue';
import ClickableLink from '@/components/ui/ClickableLink.vue';
import { authService } from '@/services';

export default {
  components: {
    ClickableLink,
    DropdownNavItem,
    DropdownItem,
  },
  data() {
    return {
      navItems: [
        [{ path: '/productions' }, 'Whats On'],
        [{ path: '/societies' }, 'Societies'],
      ],
      open: false,
      authService,
    };
  },
  watch: {
    $route() {
      this.open = false;
    },
  },
  methods: {
    onLogout() {
      this.$auth().logout();
      this.$router.push('/');
    },
    closeUserMenu() {
      if (this.$refs['user-dropdown']) {
        this.$refs['user-dropdown'].hideMenu();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
nav > a.router-link-exact-active {
  @apply text-sta-orange;
}
.auth-button {
  @apply inline-block;
}
</style>
