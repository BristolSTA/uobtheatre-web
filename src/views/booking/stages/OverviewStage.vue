<template>
  <div>
    <div class="space-y-4">
      <performance-overview-box
        :production="production"
        :performance="booking.performance"
      />
      <div class="grid gap-4 md:grid-cols-2 justify-evenly">
        <venue-overview :venue_slug="booking.performance.venue.slug" />
        <user-overview :booking="booking" />
      </div>
      <tickets-overview :booking="booking" />
      <booking-price-overview :booking="booking" />
    </div>
    <div class="mt-2 text-center">
      <button class="font-semibold btn btn-orange">Pay Now</button>
    </div>
  </div>
</template>

<script>
import Booking from '@/classes/Booking';
import BookingPriceOverview from '@/components/overview/BookingPriceOverview.vue';
import PerformanceOverviewBox from '@/components/overview/PerformanceOverviewBox.vue';
import TicketsOverview from '@/components/overview/TicketsOverview.vue';
import UserOverview from '@/components/overview/UserOverview.vue';
import VenueOverview from '@/components/overview/VenueOverview.vue';

export default {
  name: 'overview-stage',
  components: {
    VenueOverview,
    PerformanceOverviewBox,
    UserOverview,
    TicketsOverview,
    BookingPriceOverview,
  },
  props: {
    production: {
      required: true,
    },
    booking: {
      required: true,
      type: Booking,
    },
  },
};
</script>
