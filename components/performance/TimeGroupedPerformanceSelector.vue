<template>
  <div>
    <div
      v-for="(performanceGroup, time) in groupedPerformances"
      :key="time"
      ref="performance-group"
    >
      <h2 class="mt-4 mb-2 text-white text-2xl font-semibold">
        {{ time }}
      </h2>
      <div
        class="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:gap-4 xl:grid-cols-3 2xl:grid-cols-4"
      >
        <performance-overview
          v-for="(performance, index) in performanceGroup"
          :key="index"
          class="performance"
          :performance="performance"
          @select="$emit('select-performance', performance)"
        >
          <template #select-button> Select </template>
        </performance-overview>
      </div>
    </div>
  </div>
</template>

<script>
import lo from 'lodash';
import { DateTime } from 'luxon';
import { humanDayTime } from '@/utils';
import PerformanceOverview from '@/components/performance/PerformanceOverview.vue';
export default {
  components: { PerformanceOverview },
  props: {
    performances: {
      type: Array,
      required: true
    }
  },
  computed: {
    groupedPerformances() {
      return lo
        .chain(this.performances)
        .sortBy((performance) => {
          return DateTime.fromISO(performance.start);
        })
        .groupBy((performance) => {
          return humanDayTime(DateTime.fromISO(performance.start));
        })
        .value();
    }
  }
};
</script>
