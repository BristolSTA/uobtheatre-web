<template>
  <div v-if="booking.performance && booking.performance.production">
    <div class="space-y-4">
      <performance-overview
        :production="booking.performance.production"
        :performance="booking.performance"
      />
      <div class="grid gap-4 grid-cols-1 justify-evenly md:grid-cols-2">
        <venue-overview
          :venue-data="booking.performance.venue.slug"
          :online="booking.performance.isOnline"
          :in-person="booking.performance.isInperson"
        />
        <user-overview />
      </div>
      <tickets-overview :booking="booking" />
      <booking-price-overview :booking="booking" />
    </div>
    <div class="mt-4 text-center">
      <button
        class="btn btn-orange font-semibold"
        @click="$emit('next-stage')"
        @keypress="$emit('next-stage')"
      >
        Proceed to payment
      </button>
    </div>
  </div>
</template>

<script>
import Booking from "@/classes/Booking";
import BookingPriceOverview from "@/components/booking/overview/BookingPriceOverview.vue";
import PerformanceOverview from "@/components/booking/overview/PerformanceOverview.vue";
import TicketsOverview from "@/components/booking/overview/TicketsOverview.vue";
import UserOverview from "@/components/booking/overview/UserOverview.vue";
import VenueOverview from "@/components/booking/overview/VenueOverview.vue";

import BookingStage from "@/classes/BookingStage";
export default {
  stageInfo: new BookingStage({
    name: "Overview",
    routeName: "production-slug-book-performanceId-overview",
    eligable: (_, booking) => !booking.dirty,
  }),
  components: {
    VenueOverview,
    PerformanceOverview,
    UserOverview,
    TicketsOverview,
    BookingPriceOverview,
  },
  props: {
    booking: {
      required: true,
      type: Booking,
    },
  },
};
</script>
