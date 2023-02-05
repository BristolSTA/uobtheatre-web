<template>
  <div class="flex-none flex justify-around text-white items-center">
    <UiClock class="text-4xl hidden md:block" />
    <PerformanceSummaryPill
      v-if="performance"
      :performance="performance"
      class="bg-sta-gray-dark rounded-md p-3"
    />
    <NuxtLink class="underline">Exit Box Office</NuxtLink>
  </div>
</template>

<script lang="ts" setup>
const performance = inject(injectionKeys.boxOffice.performance);
</script>
