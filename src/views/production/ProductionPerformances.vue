<template>
  <div class="container my-6 text-white">
    <div class="text-center"><h1 class="text-h2">Dates and Times</h1></div>
    <div
      class="my-20 text-xl text-center"
      v-if="!production.performances.length"
    >
      No Upcoming Performances
    </div>
    <div v-else class="flex flex-wrap justify-center space-x-2">
      <performance-overview
        class="px-10"
        v-for="performance in production.performances"
        :key="performance.id"
        :performance="performance"
        @select="
          $router.push({
            name: 'production.book.select',
            params: { productionSlug: production.slug },
          })
        "
      />
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
  methods: {
    performanceDisabled(performance) {
      return performance.disabled || performance.sold_out;
    },
    disabledReason(performance) {
      if (performance.sold_out) return 'SOLD OUT';
      return 'Unavailable';
    },
  },
};
</script>
