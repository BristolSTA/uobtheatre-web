<template>
  <NuxtLink
    :href="
      totalTicketsAvailable ? `/box-office/${performanceId}/sell` : undefined
    "
    class="text-3xl text-white p-3 px-8 hidden md:block"
    :class="[totalTicketsAvailable ? 'bg-sta-green' : 'bg-sta-gray-dark']"
  >
    <div><font-awesome-icon icon="cash-register" class="mr-2" /> Sell</div>
    <p v-if="totalTicketsAvailable !== undefined" class="text-sm">
      <template v-if="totalTicketsAvailable"
        >{{ totalTicketsAvailable }} available</template
      >
      <template v-else>SOLD OUT</template>
    </p>
  </NuxtLink>
</template>

<script lang="ts" setup>
import { useBoxOfficePerformanceTicketsAvailableQuery } from '~~/graphql/codegen/operations';
import type { IdInput } from '~~/types/generic';

const props = defineProps<{
  performanceId: IdInput;
}>();

const { result } = useBoxOfficePerformanceTicketsAvailableQuery(
  { id: props.performanceId },
  {
    pollInterval: 60 * 1000 // Every minute
  }
);

const totalTicketsAvailable = computed<number | undefined>(
  () =>
    result.value?.performance?.ticketsBreakdown.totalTicketsAvailable ??
    undefined
);
</script>
