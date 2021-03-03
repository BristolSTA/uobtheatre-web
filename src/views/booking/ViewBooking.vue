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
    </div>
  </div>
</template>

<script>
import Booking from '@/classes/Booking';
import PerformanceOverview from '@/components/booking/overview/PerformanceOverview.vue';
import TicketsOverview from '@/components/booking/overview/TicketsOverview.vue';
import UserOverview from '@/components/booking/overview/UserOverview.vue';
import VenueOverview from '@/components/booking/overview/VenueOverview.vue';

export default {
  name: 'ViewBooking',
  components: {
    VenueOverview,
    PerformanceOverview,
    UserOverview,
    TicketsOverview,
  },
  props: {},
  data() {
    return {
      booking: new Booking(),
    };
  },
  apollo: {
    booking: {
      query: require('@/graphql/queries/PaidBookingForPerformance.gql'),
      // variables: {
      //   bookingId: 1,
      // },
      update: (data) => data.authUser.bookings.edges[0].node,
    },
  },
};
</script>
