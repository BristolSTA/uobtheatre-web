<template>
  <div>
    <div class="space-y-4">
      <performance-overview
        :production="production"
        :performance="booking.performance"
      />
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 justify-evenly">
        <venue-overview
          :venue-data="booking.performance.venue.slug"
          :online="booking.performance.isOnline"
          :in-person="booking.performance.isInperson"
        />
        <user-overview :user="{}" />
      </div>
      <tickets-overview :booking="booking" />
      <booking-price-overview :booking="booking" />
    </div>
    <div class="mt-4 text-center">
      <button
        class="font-semibold btn btn-orange"
        @click="$emit('next-stage')"
        @keypress="$emit('next-stage')"
      >
        Proceed to payment
      </button>
    </div>
  </div>
</template>

<script>
import Booking from '@/classes/Booking';
import BookingPriceOverview from '@/components/booking/overview/BookingPriceOverview.vue';
import PerformanceOverview from '@/components/booking/overview/PerformanceOverview.vue';
import TicketsOverview from '@/components/booking/overview/TicketsOverview.vue';
import UserOverview from '@/components/booking/overview/UserOverview.vue';
import VenueOverview from '@/components/booking/overview/VenueOverview.vue';

export default {
  name: 'OverviewStage',
  components: {
    VenueOverview,
    PerformanceOverview,
    UserOverview,
    TicketsOverview,
    BookingPriceOverview,
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
  created() {
    // Check eligability for this stage
    if (this.booking.dirty) return this.$emit('stage-unable');
  },
};
</script>
