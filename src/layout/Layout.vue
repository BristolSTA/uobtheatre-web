<template>
  <div>
    <nav-bar />
    <slot />
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
