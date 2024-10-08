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
          {{ appConfig.name }}
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
        <dropdown-nav-item v-if="authStore.user" ref="userDropdownComponent">
          <span class="capitalize pr-1">
            Hi, {{ authStore.user.firstName }}
          </span>
          <span role="img">👋</span>
          <template #content>
            <div class="grid gap-4 grid-cols-1 md:grid-cols-2 text-gray-900">
              <dropdown-item
                v-if="authStore.hasPermission('admin_open')"
                title="Admin"
                subtitle="Control productions and other tools"
                icon="user-shield"
                route="/administration"
                @click="closeUserMenu"
              />
              <dropdown-item
                v-if="authStore.hasPermission('boxoffice_open')"
                title="Box Office"
                subtitle="Check in and sell tickets"
                icon="ticket"
                route="/box-office"
                @click="closeUserMenu"
              />
              <dropdown-item
                title="Your Account"
                subtitle="Edit your details"
                icon="user-pen"
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
                icon="fa-right-to-bracket"
                route="/login"
                @click="closeUserMenu"
              />
              <dropdown-item
                title="Register"
                subtitle="Create a new account"
                icon="fa-solid fa-user-pen"
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

<script setup>
import DropdownItem from './DropdownItem.vue';
import DropdownNavItem from './DropdownNavItem.vue';
import ClickableLink from '@/components/ui/ClickableLink.vue';
import useAuthStore from '@/store/auth';

const userDropdownComponent = ref(null);
const authStore = useAuthStore();
const appConfig = useAppConfig();
const navItems = [
  [{ path: '/productions' }, "What's On"],
  [{ path: '/societies' }, 'Societies']
];
const open = ref(false);

const route = useRoute();
watch(route, () => {
  open.value = false;
});

function onLogout() {
  authStore.logout();
}

function closeUserMenu() {
  if (userDropdownComponent.value) {
    userDropdownComponent.value.hideMenu();
  }
}
</script>

<style lang="postcss" scoped>
nav > a.router-link-exact-active {
  @apply text-sta-orange;
}
.auth-button {
  @apply inline-block;
}
</style>
