<template>
  <div class="h-screen flex flex-col">
    <nav-bar />
    <main class="flex-1">
      <slot />
    </main>
    <footer-bar />
  </div>
</template>

<script>
import FooterBar from './FooterBar.vue';
import NavBar from './NavBar.vue';
export default {
  components: { NavBar, FooterBar },
  name: 'Layout',
};
</script>
