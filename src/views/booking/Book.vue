<template>
  <div class="min-h-full bg-sta-gray">
    <div class="container">
      <div class="pt-2 text-white">
        <router-link
          :to="{
            name: 'production',
            params: { productionSlug: production.slug },
          }"
        >
          <font-awesome-icon icon="chevron-left" />
          Back to Production
        </router-link>
      </div>
      <production-banner
        class="pb-2 md:pb-8"
        :production="production"
        :show-buy-tickets-button="false"
        :show-detailed-info="false"
      />
      <div class="flex flex-wrap mb-2 md:space-x-2 md:flex-nowrap">
        <booking-navigation
          class="hidden md:flex md:w-1/4"
          :current-stage-index="currentStageIndex"
          :max-allowed-stage-index="maxAllowedStageIndex"
          :production="production"
          :booking="booking"
          @goto-stage="navigateToStage"
        />
        <div class="w-full mb-1 text-center md:hidden">
          <h1 class="text-h1 text-sta-green">{{ $route.meta.stage.name }}</h1>
          <clickable-link
            v-if="currentStageIndex > 0"
            class="text-white"
            @click="gotoPreviousStage"
          >
            <font-awesome-icon icon="chevron-left" />Back
          </clickable-link>
        </div>
        <div
          id="booking-view"
          class="flex-grow max-w-full p-1 pb-4 sm:p-3 bg-sta-gray-dark"
        >
          <router-view
            :production="production"
            :booking="booking"
            :ticket-matrix="ticketMatrix"
            @select-performance="onSelectPerformance"
            @next-stage="navigateToStage()"
            @stage-unable="gotoPreviousStage()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Booking from '@/classes/Booking';
import TicketsMatrix from '@/classes/TicketsMatrix';
import BookingNavigation from '@/components/booking/BookingNavigation.vue';
import ProductionBanner from '@/components/production/ProductionBanner.vue';
import ClickableLink from '@/components/ui/ClickableLink.vue';
import { swal } from '@/utils';

import { getNextStage, getPreviousStage, getStageIndex } from './bookingStages';
export default {
  components: { BookingNavigation, ProductionBanner, ClickableLink },
  props: {
    production: {
      required: true,
      type: Object,
    },
  },
  beforeRouteUpdate(to, from, next) {
    // This is required incase the user navigated internally within the children ("nested") rotues or, for example, goes back, as the beforeEnter on the main route is not called (therefore slug not resolved)
    // Lets reuse the exisiting production object from the first route
    to.params.production = from.params.production;
    return next();
  },
  data() {
    return {
      booking: new Booking(),
      ticketMatrix: null,
      maxAllowedStageIndex: getStageIndex(this.$route.meta.stage),
      previousBooking: null,
    };
  },
  computed: {
    currentStageIndex() {
      return getStageIndex(this.$route.meta.stage);
    },
  },
  watch: {
    currentStageIndex() {
      this.loadDataForStage();
    },
  },
  mounted() {
    this.loadDataForStage();
    if (!this.$route.meta.stage.shouldBeUsed(this.production, this.booking)) {
      return this.navigateToStage();
    }
    if (!this.$route.meta.stage.eligable(this.production, this.booking)) {
      return this.gotoPreviousStage();
    }
  },
  metaInfo() {
    return {
      title: `Book ${this.production.name}`,
    };
  },
  methods: {
    gotoPreviousStage() {
      this.navigateToStage(
        getPreviousStage(this.currentStageIndex, this.production, this.booking)
      );
    },
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
        hash: '#booking-view',
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
        // Check if user already has a draft booking for this performnace if not already
        if (this.previousBooking === null) {
          this.$apollo
            .query({
              query: require('@/graphql/queries/DraftBookingForPerformance.gql'),
              variables: {
                performanceID: this.$route.params.performanceID,
              },
              fetchPolicy: 'no-cache',
            })
            .then(({ data }) => {
              this.previousBooking = data.authUser.bookings.edges.length
                ? data.authUser.bookings.edges[0].node
                : false;
              if (this.previousBooking) {
                swal
                  .fire({
                    title: 'Resume previous booking?',
                    text:
                      'You previously started a booking for this performance. Would you like to resume it?',
                    showCancelButton: true,
                    confirmButtonText: 'Resume',
                    cancelButtonText: 'No, start fresh',
                  })
                  .then((result) => {
                    if (result.isConfirmed) {
                      this.booking.updateFromAPIData(this.previousBooking);
                    }
                  });
              }
            });
        }

        if (!this.booking.performance) {
          this.booking.performance = this.production.performances.edges
            .map((edge) => edge.node)
            .find(
              (performance) =>
                performance.id === this.$route.params.performanceID
            );
        }

        if (!this.ticketMatrix) {
          this.$apollo
            .query({
              query: require('@/graphql/queries/PerformanceTicketOptions.gql'),
              variables: {
                id: this.booking.performance.id,
              },
            })
            .then((result) => {
              this.ticketMatrix = new TicketsMatrix(result.data.performance);
            });
        }
      }
    },
    onSelectPerformance(performance) {
      this.booking.performance = performance;
      this.booking.tickets = [];
      this.navigateToStage();
    },
  },
};
</script>
