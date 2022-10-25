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
import FooterBar from "@/components/layout/FooterBar.vue";
import NavBar from "@/components/layout/NavBar.vue";
export default {
  components: { NavBar, FooterBar },
};
</script>
