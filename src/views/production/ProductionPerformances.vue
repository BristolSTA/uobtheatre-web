<template>
  <div class="container my-6 text-white">
    <div class="text-center"><h1 class="text-h2">Dates and Times</h1></div>
    <div
      class="my-20 text-xl text-center"
      v-if="!production.performances.length"
    >
      No Upcoming Performances
    </div>
    <div v-else class="flex flex-wrap justify-center md:space-x-2">
      <performance-overview
        class="w-3/4 mt-2 md:w-9/20 lg:w-1/3 2xl:w-1/4"
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
    performanceVenue(performance) {
      if (performance.is_inperson && performance.is_online)
        return performance.venue.name + ' and Online';
      if (performance.is_online) return 'Online';
      return performance.venue.name;
    },
  },
};
</script>
