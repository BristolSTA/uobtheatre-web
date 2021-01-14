<template>
  <div class="min-h-full bg-sta-gray">
    <div class="container">
      <div class="pt-2 text-white">
        <router-link
          :to="{
            name: 'production',
            params: { productionSlug: production.slug },
          }"
          ><font-awesome-icon icon="chevron-left" />
          Back to Production
        </router-link>
      </div>
      <production-banner
        class="pb-8"
        :production="production"
        :showBuyTicketsButton="false"
      />
      <div class="flex flex-wrap mb-2 space-x-2 md:flex-nowrap">
        <booking-navigation
          class="hidden md:flex md:w-1/4"
          :currentStageIndex="currentStageIndex"
          :maxAllowedStageIndex="maxAllowedStageIndex"
          :production="production"
          :booking="booking"
          @goto-stage="navigateToStage"
        />
        <div class="w-full text-center md:hidden">
          <h1 class="text-h1 text-sta-green">{{ $route.meta.stage.name }}</h1>
          <clickable-link class="text-white" @click="gotoPreviousStage"
            ><font-awesome-icon icon="chevron-left" /> Back</clickable-link
          >
        </div>
        <div class="flex-grow p-3 bg-sta-gray-dark">
          <router-view
            :production="production"
            :booking="booking"
            :ticket_types_data="ticket_types"
            @select-performance="onSelectPerformance"
            @next-stage="navigateToStage()"
          ></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Booking from '@/classes/Booking';
import BookingStage from '@/classes/BookingStage';
import BookingNavigation from '@/components/booking/BookingNavigation.vue';
import ProductionBanner from '@/components/production/ProductionBanner.vue';
import ClickableLink from '@/components/ui/ClickableLink.vue';
import { performanceService } from '@/services';
import { runPromiseWithLoading } from '@/utils';

import { getNextStage, getPreviousStage, getStageIndex } from './bookingStages';
export default {
  components: { BookingNavigation, ProductionBanner, ClickableLink },
  props: {
    production: {
      required: true,
    },
  },
  beforeRouteEnter(to, from, next) {
    // TODO: Check here if the user has an exisiting booking (can see if they can enter the route they are trying to go to)
    next();
  },
  beforeRouteUpdate(to, from, next) {
    // This is required incase the user navigated internally within the children ("nested") rotues or, for example, goes back, as the beforeEnter on the main route is not called (therefore slug not resolved)
    // Lets reuse the exisiting production object from the first route
    to.params.production = from.params.production;
    return next();
  },
  created() {
    this.loadDataForStage();
  },
  metaInfo() {
    return {
      title: `Book ${this.production.name}`,
    };
  },
  watch: {
    currentStageIndex() {
      this.loadDataForStage();
    },
  },
  data() {
    return {
      booking: new Booking(),
      ticket_types: null,
      maxAllowedStageIndex: getStageIndex(this.$route.meta.stage),
    };
  },
  methods: {
    gotoPreviousStage() {
      this.navigateToStage(
        getPreviousStage(this.currentStageIndex, this.production, this.booking)
      );
    },
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
    loadDataForStage() {
      if (this.$route.params.performanceID) {
        if (!this.booking.performance) {
          this.booking.performance = this.production.performances.find(
            (performance) => performance.id === this.$route.params.performanceID
          );
        }
        if (!this.ticket_types) {
          runPromiseWithLoading(
            performanceService
              .fetchTicketOptionsForPerformance(
                this.production.slug,
                this.booking.performance.id
              )
              .then((results) => {
                this.ticket_types = results.ticket_types;
              })
          );
        }
      }
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
