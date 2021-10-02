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
      <div class="grid grid-cols-2 gap-2 md:gap-4 md:grid-cols-4">
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
import { groupBy } from 'lodash'
import { DateTime } from 'luxon'
import PerformanceOverview from '@/components/performance/PerformanceOverview.vue'
export default {
  components: { PerformanceOverview },
  props: {
    performances: {
      type: Array,
      required: true,
    },
  },
  computed: {
    groupedPerformances() {
      return groupBy(this.performances, (performance) => {
        const time = DateTime.fromISO(performance.start)
        if (time.hour < 12) return 'Morning'
        if (time.hour < 17) return 'Afternoon'
        return 'Evening'
      })
    },
  },
}
</script>
