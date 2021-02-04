<template>
  <div class="flex flex-col h-screen">
    <nav-bar />
    <main class="flex-1">
      <slot></slot>
    </main>
    <footer-bar />
  </div>
</template>

<script>
import FooterBar from './FooterBar.vue';
import NavBar from './NavBar.vue';
export default {
  name: 'Layout',
  components: { NavBar, FooterBar },
};
</script>
