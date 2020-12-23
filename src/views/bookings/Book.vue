<template>
  <div class="min-h-full bg-sta-gray">
    <div class="container">
      <production-banner
        :production="production"
        :showBuyTicketsButton="false"
      />
      <div class="flex mb-2 space-x-2">
        <booking-navigation
          class="w-1/4"
          :currentStageIndex="currentStageIndex"
          :maxAllowedStageIndex="maxAllowedStageIndex"
          :production="production"
          :booking="booking"
          @goto-stage="navigateToStage"
        />
        <div class="flex-grow p-3 bg-sta-gray-dark">
          <router-view
            :production="production"
            :booking="booking"
            @select-performance="onSelectPerformance"
          ></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BookingStage from '@/classes/BookingStage';
import ProductionBanner from '@/components/production/ProductionBanner.vue';
import BookingNavigation from '@/views/bookings/components/BookingNavigation.vue';

import { getNextStage, getStageIndex } from './bookingStages';
export default {
  components: { BookingNavigation, ProductionBanner },
  props: {
    production: {
      required: true,
    },
  },
  beforeRouteUpdate(to, from, next) {
    // This is required incase the user navigated internally within the children ("nested") rotues or, for example, goes back, as the beforeEnter on the main route is not called (therefore slug not resolved)
    // Lets reuse the exisiting production object from the first route
    to.params.production = from.params.production;
    return next();
  },
  created() {
    if (this.$route.params.performanceID) {
      this.booking.performance = this.production.performances.find(
        (performance) => performance.id === this.$route.params.performanceID
      );
    }
  },
  metaInfo() {
    return {
      title: `Book ${this.production.name}`,
    };
  },
  data() {
    return {
      booking: {
        performance: null,
        tickets: [],
      },
      maxAllowedStageIndex: getStageIndex(this.$route.meta.stage),
    };
  },
  methods: {
    /**
     * @param {BookingStage|null} stage Stage to navigate to. If not provided, defaults to the next stage
     */
    navigateToStage(stage = null) {
      if (!stage)
        stage = getNextStage(
          this.currentStageIndex,
          this.production,
          this.booking
        );

      if (getStageIndex(stage) > this.maxAllowedStageIndex)
        this.maxAllowedStageIndex = getStageIndex(stage);

      this.$router.push({
        name: stage.getRouteName(),
        params: {
          production: this.production,
          performanceID: this.booking.performance
            ? this.booking.performance.id
            : null,
        },
      });
    },
    onSelectPerformance(performance) {
      this.booking.performance = performance;
      this.booking.tickets = [];
      this.navigateToStage();
    },
  },
  computed: {
    currentStageIndex() {
      return getStageIndex(this.$route.meta.stage);
    },
  },
};
</script>
