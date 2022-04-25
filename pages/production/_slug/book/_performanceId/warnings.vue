<template>
  <div
    v-if="booking.performance"
    class="flex flex-col items-center justify-evenly min-h-full"
  >
    <card
      v-if="booking.performance.description"
      ref="perf-description"
      class="w-full mb-2"
    >
      <template #subtitle>
        <span class="text-xl">Performance Information</span>
      </template>
      {{ booking.performance.description }}
    </card>
    <div class="mb-2 p-6 pt-3 text-white bg-sta-rouge">
      <h2 class="text-h3 sm:text-h2">
        Please note the following warnings for this production:
      </h2>

      <ul class="list-inside list-disc">
        <li v-for="(warning, index) in production.warnings" :key="index">
          {{ warning.description }}
        </li>
      </ul>
    </div>
    <div>
      <button
        class="btn btn-rouge btn-outline"
        @click="onUnderstood"
        @keypress="onUnderstood"
      >
        I Understand
      </button>
    </div>
  </div>
</template>

<script>
import BookingStage from '@/classes/BookingStage'
import Booking from '@/classes/Booking'
import Card from '@/components/ui/Card.vue'

export default {
  stageInfo: new BookingStage({
    name: 'Auidence Warnings',
    routeName: 'production-slug-book-performanceId-warnings',
    shouldBeUsed: (production, booking) => {
      return production.warnings.length > 0 || booking?.performance?.description
    },
  }),
  components: {
    Card,
  },
  props: {
    production: {
      required: true,
      type: Object,
    },
    booking: {
      required: true,
      type: Booking,
    },
  },
  methods: {
    onUnderstood() {
      this.$emit('next-stage')
    },
  },
}
</script>
