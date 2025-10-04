<template>
  <div
    v-if="booking.performance"
    class="flex flex-col items-center min-h-full gap-4 p-4 sm:p-0"
  >
    <div
      v-if="booking.performance.description"
      class="flex flex-basis gap-4 justify-evenly w-full"
    >
      <div
        ref="perf-description"
        class="p-4 text-white bg-sta-gray-light rounded-lg w-full"
      >
        <h3 class="text-h3 font-semibold mb-2 gap-4 flex items-center">
          <font-awesome-icon icon="masks-theater" />
          Performance-Specific Information
        </h3>
        <p>{{ booking.performance.description }}</p>
      </div>
    </div>
    <div class="flex gap-4 flex-col lg:flex-row">
      <div
        v-if="production.contentWarnings.length > 0"
        ref="perf-warnings"
        class="flex gap-4 justify-evenly w-full"
      >
        <div class="p-4 text-white bg-sta-gray-light rounded-lg w-full">
          <h3 class="text-h3 font-semibold mb-2 gap-4 flex items-center">
            <font-awesome-icon icon="info-circle" />
            Content Warnings
          </h3>
          <p>
            This production features content that may be distressing to some
            audience members. To view the content warnings for this production,
            click the button below (may contain some 'spoilers' to the plot). If
            you have any questions about the content of this production, please
            contact
            <a :href="`mailto:${production.contactEmail}`" class="underline">
              {{ production.contactEmail }} </a
            >.
          </p>
          <UButton
            ref="warnings"
            color="success"
            class="font-semibold uppercase rounded-xs gap-2 mt-4"
            @click="showContentWarningsDetail = true"
          >
            View content warnings
            <font-awesome-icon icon="chevron-right" />
          </UButton>
          <content-warnings-display
            v-if="showContentWarningsDetail"
            :content-warnings="production.contentWarnings"
            :contact-email="production.contactEmail"
            @close="showContentWarningsDetail = false"
          />
        </div>
      </div>
      <div
        v-if="production.productionAlert"
        ref="perf-alert"
        class="flex not-lg:flex-basis gap-4 justify-evenly w-full lg:col-span-1"
      >
        <div class="p-4 text-white bg-sta-gray-light rounded-lg w-full">
          <h3 class="text-h3 font-semibold mb-2 gap-4 flex items-center">
            <font-awesome-icon icon="warning" />
            Production Alert
          </h3>
          <p>
            {{
              /[.!?]$/.test(production.productionAlert)
                ? production.productionAlert
                : production.productionAlert + '.'
            }}
          </p>
          <p class="mt-2">
            For more information, please contact
            <a :href="`mailto:${production.contactEmail}`" class="underline">{{
              production.contactEmail
            }}</a
            >.
          </p>
        </div>
      </div>
    </div>
    <div>
      <UButton
        ref="understood"
        color="warning"
        class="font-semibold uppercase rounded-xs gap-2 text-md"
        @click="onUnderstood"
        @keypress="onUnderstood"
      >
        Continue Booking
        <font-awesome-icon class="ml-2" icon="arrow-right" />
      </button>
    </div>
  </div>
</template>

<script>
import BookingStage from '@/classes/BookingStage';
import Booking from '~~/classes/Booking';

import ContentWarningsDisplay from '@/components/production/content-warnings/ContentWarningsDisplay.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const stageInfo = new BookingStage({
  name: 'Performance Warnings',
  routeName: 'production-slug-book-performanceId-warnings',
  shouldBeUsed: (production, booking) => {
    return (
      production.contentWarnings.length > 0 ||
      booking?.performance?.description ||
      production.productionAlert
    );
  }
});

export default defineNuxtComponent({
  stageInfo,
  components: {
    FontAwesomeIcon,
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
  emits: ['mounted', 'next-stage'],
  data() {
    return {
      showContentWarningsDetail: false
    };
  },
  mounted() {
    this.$emit('mounted', stageInfo);
  },
  methods: {
    onUnderstood() {
      this.$emit('next-stage');
    }
  }
});
</script>
