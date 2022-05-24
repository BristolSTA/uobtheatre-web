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
    <div class="mb-2 p-6 pt-3 text-white">
      <h3 class="text-h3 font-semibold">
        <font-awesome-icon icon="exclamation-triangle" class="text-sta-rouge" />
        Content Warnings
      </h3>
      <p>
        This production features content warnings that may make it unsuitable or
        distressing to viewers. For more information, please contact
        <a :href="`mailto:${contactEmail}`" class="underline">{{
          contactEmail
        }}</a
        >.
      </p>

      <hr class="my-2 border-sta-gray-light" />
      <content-warnings-display :content-warnings="contentWarningData" />
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
import ContentWarningsDisplay from '@/components/production/content-warnings/ContentWarningsDisplay.vue'

export default {
  stageInfo: new BookingStage({
    name: 'Content Warnings',
    routeName: 'production-slug-book-performanceId-warnings',
    shouldBeUsed: (production, booking) => {
      return production.warnings.length > 0 || booking?.performance?.description
    },
  }),
  components: {
    Card,
    ContentWarningsDisplay,
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
  data() {
    return {
      contentWarningData: [
        // TODO: Remove and replace with actual data
        {
          name: 'Themes of Suicide',
          description: null,
        },
        {
          name: 'Themes of Gore',
          description: 'Lots of blood everywhere',
        },
        {
          name: 'Themes of Mental Illness',
        },
        {
          name: 'Strobe Lighting',
        },
        {
          name: 'Other',
          description: 'Use of fake blood throughout performance',
        },
      ],
      contactEmail: 'email@address.com', // TODO: Remove and replace with actual data
    }
  },
  methods: {
    onUnderstood() {
      this.$emit('next-stage')
    },
  },
}
</script>
