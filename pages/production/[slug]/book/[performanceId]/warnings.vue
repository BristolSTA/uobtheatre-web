<template>
  <div
    v-if="booking.performance"
    class="flex flex-col items-center justify-evenly min-h-full"
  >
    <UiCard
      v-if="booking.performance.description"
      ref="perf-description"
      class="w-full mb-2"
    >
      <template #subtitle>
        <span class="text-xl">Performance Information</span>
      </template>
      {{ booking.performance.description }}
    </UiCard>
    <div class="mb-2 p-6 pt-3 text-white">
      <h3 class="text-h3 font-semibold">
        <font-awesome-icon icon="exclamation-triangle" class="text-sta-rouge" />
        Content Warnings
      </h3>
      <p>
        This production features content warnings that may make it unsuitable or
        distressing to viewers. For more information, please contact
        <a :href="`mailto:${production.contactEmail}`" class="underline">{{
          production.contactEmail
        }}</a
        >.
      </p>

      <hr class="my-2 border-sta-gray-light" />
      <content-warnings-display
        :content-warnings="production.contentWarnings"
      />
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
import BookingStage from '@/classes/BookingStage';
import Booking from '~~/classes/Booking';

import ContentWarningsDisplay from '@/components/production/content-warnings/ContentWarningsDisplay.vue';

const stageInfo = new BookingStage({
  name: 'Content Warnings',
  routeName: 'production-slug-book-performanceId-warnings',
  shouldBeUsed: (production, booking) => {
    return (
      production.contentWarnings.length > 0 || booking?.performance?.description
    );
  }
});

export default defineNuxtComponent({
  stageInfo,
  components: {
    ContentWarningsDisplay
  },
  props: {
    production: {
      required: true,
      type: Object
    },
    booking: {
      required: true,
      type: Booking
    }
  },
  methods: {
    onUnderstood() {
      this.$emit('next-stage');
    }
  },
  mounted() {
    this.$emit('mounted', stageInfo);
  }
});
</script>
