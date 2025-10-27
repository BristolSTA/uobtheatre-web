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
    <div
      v-if="booking.performance.isRelaxed"
      class="flex flex-basis gap-4 justify-evenly w-full"
    >
      <div
        ref="perf-description"
        class="p-4 text-white bg-sta-gray-light rounded-lg w-full flex flex-col"
      >
        <h3 class="text-h3 font-semibold mb-2 gap-4 flex items-center">
          <font-awesome-icon icon="heart" />
          {{ booking.performance.relaxedName }} Performance
        </h3>
        <p class="mb-2">
          This performance has been adapted to be more suitable for different
          audience members. Click below to see which adaptations have been made
          to this performance.
        </p>
        <button
          ref="categories"
          class="font-semibold btn btn-rouge w-fit self-center"
          @click="showRelaxedCategoriesDetail = true"
        >
          View Performance Adaptations
          <font-awesome-icon class="ml-2" icon="chevron-right" />
        </button>
        <relaxed-categories-display
          v-if="showRelaxedCategoriesDetail"
          :relaxed-categories="booking.performance.relaxedCategories"
          :this-relaxed-name="booking.performance.relaxedName"
          @close="showRelaxedCategoriesDetail = false"
        />
      </div>
    </div>
    <div class="flex gap-4 flex-col">
      <div
        v-if="production.contentWarnings.length > 0"
        ref="perf-warnings"
        class="flex gap-4 justify-evenly w-full"
      >
        <div
          class="p-4 text-white bg-sta-gray-light rounded-lg w-full space-y-2 flex flex-col"
        >
          <h3 class="text-h3 font-semibold gap-4 flex items-center">
            <font-awesome-icon icon="info-circle" />
            Content Warnings
          </h3>
          <p v-if="booking.performance.isRelaxed">
            This production features content that may be distressing to some
            audience members. You can view the content warnings for this
            production below, but please be aware that some of the warnings will
            no longer apply due to additional adaptations to this performance,
            which you can view above. If you have any questions about the
            content or adaptations of this specific performance, please contact
            <a :href="`mailto:${production.contactEmail}`" class="underline">
              {{ production.contactEmail }} </a
            >.
          </p>
          <p v-else>
            This production features content that may be distressing to some
            audience members. To view the content warnings for this production,
            click the button below (may contain some 'spoilers' to the plot). If
            you have any questions about the content of this production, please
            contact
            <a :href="`mailto:${production.contactEmail}`" class="underline">
              {{ production.contactEmail }} </a
            >.
          </p>
          <button
            ref="warnings"
            color="success"
            class="font-semibold btn btn-rouge w-fit self-center"
            @click="showContentWarningsDetail = true"
          >
            View Content Warnings
            <font-awesome-icon class="ml-2" icon="chevron-right" />
          </button>
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
        <div
          class="p-4 text-white bg-sta-gray-light rounded-lg w-full space-y-2"
        >
          <h3 class="text-h3 font-semibold gap-4 flex items-center">
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
        </div>
      </div>
    </div>
    <div>
      <button
        ref="understood"
        color="warning"
        class="btn btn-orange font-semibold"
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
import RelaxedCategoriesDisplay from '~/components/performance/relaxed-categories/RelaxedCategoriesDisplay.vue';

const stageInfo = new BookingStage({
  name: 'Performance Warnings',
  routeName: 'production-slug-book-performanceId-warnings',
  shouldBeUsed: (production, booking) => {
    return (
      production.contentWarnings.length > 0 ||
      booking?.performance?.description ||
      production.productionAlert ||
      booking?.performance?.isRelaxed
    );
  }
});

export default defineNuxtComponent({
  stageInfo,
  components: {
    RelaxedCategoriesDisplay,
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
      showContentWarningsDetail: false,
      showRelaxedCategoriesDetail: false
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
