<template>
  <div class="flex flex-col h-screen font-body">
    <LayoutNavBar />
    <UiBreadcrumbs v-if="crumbs" :crumbs="crumbs" />
    <main class="flex-1 pb-2 text-white bg-sta-gray">
      <slot ref="pageComponent" />
    </main>
    <LayoutFooterBar />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Load the "pageComponent" ref from the template
const pageComponent = ref(null);

// Declare the "crumbs" computed property
const crumbs = computed(() => {
  if (!pageComponent.value) {
    return null;
  }

  return [];
  // return pageComponent.$children[0].crumbs;
});

// const getCrumbs = () => {
//   crumbs.run();
//   this.$forceUpdate();
// };

// // Watch route for change. If it changes, we'll reset the breadcrumbs
// const route = useRoute();
// watch(route, () => {
//   const timer = setInterval(() => {
//     if (pageComponent.$children.length > 0) {
//       getCrumbs();
//       clearInterval(timer);
//     }
//   }, 100);
// });
</script>
