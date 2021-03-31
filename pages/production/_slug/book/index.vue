<template>
  <div>
    <div
      v-for="(performanceGroup, time) in groupedPerformances"
      :key="time"
      ref="performance-group"
      class="mb-4"
    >
      <h2 class="mb-2 text-2xl font-semibold text-white">
        {{ time }}
      </h2>
      <div class="grid gap-2 md:grid-cols-2">
        <performance-overview
          v-for="(performance, index) in performanceGroup"
          :key="index"
          :performance="performance"
          @select="$emit('select-performance', performance)"
        >
          <template #select-button>Select</template>
        </performance-overview>
      </div>
    </div>
  </div>
</template>

<script>
import lo from 'lodash'
import { DateTime } from 'luxon'

import PerformanceOverview from '@/components/production/PerformanceOverview.vue'
import BookingStage from '@/classes/BookingStage'
export default {
  stageInfo: new BookingStage({
    name: 'Select Performance',
    routeName: 'production-slug-book',
    requiresPerformance: false,
  }),
  components: { PerformanceOverview },
  props: {
    production: {
      required: true,
      type: Object,
    },
  },
  computed: {
    availablePerformances() {
      return this.production.performances.edges
        .map((edge) => edge.node)
        .filter((performance) => !(performance.disabled || performance.soldOut))
    },
    groupedPerformances() {
      return lo.groupBy(this.availablePerformances, (performance) => {
        const time = DateTime.fromISO(performance.start)
        if (time.hour < 12) return 'Morning'
        if (time.hour < 17) return 'Afternoon'
        return 'Evening'
      })
    },
  },
}
</script>
