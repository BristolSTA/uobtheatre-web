<template>
  <time-grouped-performance-selector
    :performances="availablePerformances"
    class="m-3"
    @select-performance="$emit('select-performance', $event)"
  />
</template>

<script>
import BookingStage from '@/classes/BookingStage'
import TimeGroupedPerformanceSelector from '@/components/performance/TimeGroupedPerformanceSelector.vue'
export default {
  stageInfo: new BookingStage({
    name: 'Select Performance',
    routeName: 'production-slug-book',
    requiresPerformance: false
  }),
  components: { TimeGroupedPerformanceSelector },
  props: {
    production: {
      required: true,
      type: Object
    }
  },
  computed: {
    availablePerformances () {
      return this.production.performances.edges
        .map(edge => edge.node)
        .filter(performance => !(performance.disabled || performance.soldOut))
    }
  }
}
</script>
