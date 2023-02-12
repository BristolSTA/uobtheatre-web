<template>
  <div class="flex gap-x-3 items-center">
    <ProductionPosterImage
      :image-object="performance.production.posterImage"
      class="h-16"
    />
    <div class="flex flex-col items-center">
      <div class="text-lg font-semibold">
        {{ performance.production.name }}
      </div>
      <div class="text-xs font-semibold">
        {{
          dateFormatLocale(performance.start, {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })
        }}
        @
        {{
          dateFormatLocale(performance.start, {
            timeStyle: 'short'
          })
        }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IPerformanceSummary } from '../box-office/BoxOfficeSharedTypes';

defineProps<{
  performance: IPerformanceSummary;
}>();
</script>
