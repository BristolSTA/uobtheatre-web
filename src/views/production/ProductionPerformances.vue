<template>
  <div class="container my-6 text-white">
    <div class="text-center"><h1 class="text-h2">Dates and Times</h1></div>
    <div
      class="my-20 text-xl text-center"
      v-if="!production.performances.edges.length"
    >
      No Upcoming Performances
    </div>
    <div v-else class="flex flex-wrap justify-center lg:flex-nowrap">
      <div
        class="w-full performance md:w-1/2 lg:w-1/3 2xl:w-1/4"
        v-for="performance in production.performances.edges.map(
          (edge) => edge.node
        )"
        :key="performance.id"
        class="w-full p-4 md:w-1/2 lg:flex-1"
      >
        <performance-overview
          :performance="performance"
          class="h-full"
          @select="
            $router.push({
              name: 'production.book.select',
              params: { productionSlug: production.slug },
            })
          "
        />
      </div>
    </div>
  </div>
</template>

<script>
import PerformanceOverview from '@/components/production/PerformanceOverview.vue';
export default {
  name: 'production-performances',
  components: {
    PerformanceOverview,
  },
  props: {
    production: {
      required: true,
    },
  },
};
</script>
