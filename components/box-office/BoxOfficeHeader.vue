<template>
  <div
    class="flex-none flex justify-around text-white items-center text-center"
  >
    <UiClock class="text-4xl hidden md:block" />
    <NuxtLink :href="`/box-office/${performance?.id}`"
      ><PerformanceSummaryPill
        v-if="performance"
        :performance="performance"
        :date-time-text-colour="differentDay ? 'text-sta-rouge' : undefined"
        class="bg-sta-gray-dark rounded-md p-3"
    /></NuxtLink>
    <NuxtLink class="underline" to="/box-office">Exit Box Office</NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import { DateTime } from 'luxon';

const performance = inject(injectionKeys.boxOffice.performance);

const differentDay = computed(() => {
  return (
    DateTime.now().toISODate() !==
    DateTime.fromISO(performance?.doorsOpen).toISODate()
  );
});
</script>
