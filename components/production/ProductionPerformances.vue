<template>
  <div class="container my-6 text-white">
    <template v-if="prodInPast">
      <div class="my-10 text-center">
        <p class="text-xl italic">
          You are currently viewing archive details of an event in the past.
        </p>
      </div>
    </template>
    <template v-else>
      <div class="text-center">
        <h1 class="text-h2">Dates and Times</h1>
      </div>
      <div
        v-if="!production.performances.edges.length"
        class="my-20 text-center text-xl"
      >
        No Upcoming Performances
      </div>
      <div v-else class="flex justify-center">
        <time-grouped-performance-selector
          :performances="production.performances.edges.map((edge) => edge.node)"
          @select-performance="
            (performance) =>
              $router.push(
                `/production/${production.slug}/book/${performance.id}`
              )
          "
        />
      </div>
    </template>
  </div>
</template>

<script>
import { DateTime } from "luxon";
import TimeGroupedPerformanceSelector from "@/components/performance/TimeGroupedPerformanceSelector.vue";

export default {
  name: "ProductionPerformances",
  components: {
    TimeGroupedPerformanceSelector,
  },
  props: {
    production: {
      required: true,
      type: Object,
    },
  },
  computed: {
    prodInPast() {
      return DateTime.now() > DateTime.fromISO(this.production.end);
    },
  },
};
</script>
