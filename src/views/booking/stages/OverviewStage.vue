<template>
  <div>
    <div class="px-4 py-2 mb-2 text-white md:text-center bg-sta-gray-light">
      <p class="text-h3">{{ production.name }}</p>
      <p class="text-sta-orange">
        {{ production.society.name }}
      </p>
    </div>
    <div class="grid gap-2 md:grid-cols-2 justify-evenly">
      <performance-overview
        :performance="booking.performance"
        :overview_info="true"
      />
      <div
        v-if="production.warnings"
        class="p-3 border bg-sta-gray text-sta-rouge border-sta-rouge"
        ref="warnings"
      >
        <span class="text-xl font-semibold uppercase">Audience Warnings</span>
        <ul class="list-disc list-inside">
          <li v-for="(warning, index) in production.warnings" :key="index">
            {{ warning }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Booking from '@/classes/Booking';
import PerformanceOverview from '@/components/production/PerformanceOverview.vue';

export default {
  name: 'overview-stage',
  components: { PerformanceOverview },
  props: {
    production: {
      required: true,
    },
    booking: {
      required: true,
      type: Booking,
    },
  },
};
</script>
