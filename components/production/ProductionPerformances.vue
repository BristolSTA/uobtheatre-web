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
        class="my-20 text-xl text-center"
      >
        No Upcoming Performances
      </div>
      <div v-else class="flex flex-wrap justify-center lg:flex-nowrap">
        <div
          v-for="performance in production.performances.edges.map(
            (edge) => edge.node
          )"
          :key="performance.id"
          class="w-full p-2 performance md:w-1/2 lg:w-1/3 2xl:w-1/4"
        >
          <performance-overview
            :performance="performance"
            class="h-full"
            @select="
              $router.push(
                `/production/${production.slug}/book/${performance.id}`
              )
            "
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import PerformanceOverview from "@/components/performance/PerformanceOverview.vue";
import { DateTime } from "luxon";
export default {
  name: "ProductionPerformances",
  components: {
    PerformanceOverview,
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
