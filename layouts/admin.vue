<template>
  <div class="flex flex-col h-screen font-body">
    <nav-bar />
    <main class="flex-1 text-white bg-sta-gray">
      <Nuxt />
    </main>
    <footer-bar />
  </div>
</template>

<script>
import FooterBar from '@/components/layout/LayoutFooterBar.vue';
import NavBar from '@/components/layout/LayoutNavBar.vue';
export default defineNuxtComponent({
  components: { NavBar, FooterBar }
});
</script>
