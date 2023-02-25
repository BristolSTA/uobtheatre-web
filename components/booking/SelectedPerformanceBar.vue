<template>
  <div class="p-2 bg-sta-gray-light text-center">
    <p class="text-h3">Selected Performance:</p>
    <p class="text-sta-orange">
      {{ dateFormat(performance.start, 'cccc d MMM') }}, Starting at
      {{ dateFormat(performance.start, 'T') }}
    </p>
  </div>
  <div v-if="performanceMinsAway < 15" class="bg-sta-rouge p-2 text-center">
    <h3 class="text-lg font-semibold">
      <font-awesome-icon icon="exclamation-triangle" /> Caution!
    </h3>
    <p v-if="performanceStarted">This performance has already started!</p>
    <p v-else>This performance starts in {{ performanceMinsAway }} minutes!</p>
  </div>
</template>

<script lang="ts" setup>
import { PerformanceNode } from '~~/graphql/codegen/operations';

const props = withDefaults(
  defineProps<{
    performance: Pick<PerformanceNode, 'start'>;
    enableAlreadyStartedWarning?: boolean;
  }>(),
  {
    enableAlreadyStartedWarning: true
  }
);

const performanceMinsAway = computed(() => {
  const timeDiff = new Date(props.performance.start).valueOf() - Date.now();
  return Math.round(timeDiff / (1000 * 60));
});

const performanceStarted = computed(() => performanceMinsAway.value < 0);
</script>
