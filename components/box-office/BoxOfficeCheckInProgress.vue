<template>
  <div class="text-white">
    <p
      class="uppercase tracking-wider font-bold text-sm text-center text-sta-gray-lighter"
    >
      Check In Progress
    </p>
    <div class="flex items-center gap-3">
      {{ progressPercentage }}%
      <UiProgressBar :percentage="progressPercentage" />
      {{ numTicketsCheckedIn }}/{{ performanceCapacity }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useBoxOfficePerformanceTicketBreakdownQuery } from '~~/graphql/codegen/operations';
import { IdInput } from '~~/types/generic';

const props = defineProps<{
  performanceId: IdInput;
}>();

const { result } = useBoxOfficePerformanceTicketBreakdownQuery(
  {
    id: props.performanceId
  },
  {
    pollInterval: 5000
  }
);

const numTicketsCheckedIn = computed(
  () => result.value?.performance?.ticketsBreakdown.totalTicketsCheckedIn
);
const performanceCapacity = computed(
  () => result.value?.performance?.ticketsBreakdown.totalCapacity
);

const progressPercentage = computed(() =>
  Math.floor(
    (100 * (numTicketsCheckedIn.value ?? 0)) / (performanceCapacity.value ?? 1)
  )
);
</script>
