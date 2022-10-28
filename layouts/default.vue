<template>
  <div class="flex flex-col h-screen font-body">
    <nav-bar />
    <breadcrumbs v-if="crumbs" :crumbs="crumbs" />
    <main class="flex-1 pb-2 text-white bg-sta-gray">
      <Nuxt ref="page" @hook:mounted="getCrumbs" />
    </main>
    <footer-bar />
  </div>
</template>

<script>
import FooterBar from '@/components/layout/FooterBar.vue';
import NavBar from '@/components/layout/NavBar.vue';
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue';
export default {
  components: { NavBar, FooterBar, Breadcrumbs },
  computed: {
    crumbs() {
      if (!this.$refs.page) {
        return null;
      }
      return this.$refs.page.$children[0].crumbs;
    },
  },
  watch: {
    $route() {
      const timer = setInterval(() => {
        if (this.$refs.page.$children.length > 0) {
          this.getCrumbs();
          clearInterval(timer);
        }
      }, 100);
    },
  },
  methods: {
    getCrumbs() {
      this._computedWatchers.crumbs.run();
      this.$forceUpdate();
    },
  },
};
</script>
