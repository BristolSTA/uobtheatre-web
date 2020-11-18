<template>
  <nav class="bg-sta-gray-dark p-6">
    <div class="container flex items-center justify-between flex-wrap">
      <div class="flex items-center flex-shrink-0 text-white mr-10">
        <router-link :to="{ name: 'home' }"
          ><span class="text-4xl tracking-tight uppercase">{{
            $appName
          }}</span></router-link
        >
      </div>
      <div class="block lg:hidden">
        <button
          class="px-3 py-2 border rounded text-white border-sta-orange"
          role="toggle"
          @click="navHidden = !navHidden"
          @keydown="
            (e) => {
              e.target.click();
            }
          "
        >
          <svg
            class="fill-current h-6 w-6"
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
            class="block font-semibold uppercase mt-4 mr-6 tracking-wide lg:inline-block lg:mt-0 text-white hover:text-sta-orange"
          >
            {{ item[1] }}
          </router-link>
          <router-link
            to="/login"
            class="btn btn-orange btn-outline inline-block mt-4 lg:mt-0"
            >Login</router-link
          >
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
};
</script>
