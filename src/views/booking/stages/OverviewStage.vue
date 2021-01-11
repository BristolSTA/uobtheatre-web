<template>
  <div>
    <div class="space-y-4">
      <performance-overview
        :production="production"
        :performance="booking.performance"
      />
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 justify-evenly">
        <venue-overview :venue_data="booking.performance.venue.slug" />
        <user-overview :booking="booking" />
      </div>
      <tickets-overview
        :booking="booking"
        :ticket_types_data="ticket_types_data"
      />
      <booking-price-overview :booking="booking" />
    </div>
    <div class="mt-4 text-center">
      <button class="font-semibold btn btn-orange">Pay Now</button>
    </div>
  </div>
</template>

<script>
import Booking from '@/classes/Booking';
import BookingPriceOverview from '@/components/overview/BookingPriceOverview.vue';
import PerformanceOverview from '@/components/overview/PerformanceOverview.vue';
import TicketsOverview from '@/components/overview/TicketsOverview.vue';
import UserOverview from '@/components/overview/UserOverview.vue';
import VenueOverview from '@/components/overview/VenueOverview.vue';

export default {
  name: 'overview-stage',
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
    },
    booking: {
      required: true,
      type: Booking,
    },
    ticket_types_data: {
      required: true,
    },
  },
};
</script>
