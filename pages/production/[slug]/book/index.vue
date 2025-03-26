<template>
  <time-grouped-performance-selector
    :performances="availablePerformances"
    class="m-3"
    @select-performance="$emit('select-performance', $event)"
  />
</template>

<script>
import BookingStage from '@/classes/BookingStage';
import TimeGroupedPerformanceSelector from '@/components/performance/TimeGroupedPerformanceSelector.vue';
const stageInfo = new BookingStage({
  name: 'Select Performance',
  routeName: 'production-slug-book',
  requiresPerformance: false
});

export default defineNuxtComponent({
  stageInfo,
  components: { TimeGroupedPerformanceSelector },
  props: {
    production: {
      required: true,
      type: Object
    }
  },
  emits: ['select-performance', 'mounted'],
  computed: {
    availablePerformances() {
      return this.production.performances.edges
        .map((edge) => edge.node)
        .filter(
          (performance) => !(performance.disabled || performance.soldOut)
        );
    }
  },
  mounted() {
    this.$emit('mounted', stageInfo);
  }
});
</script>
