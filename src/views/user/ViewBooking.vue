<template>
  <div class="min-h-full bg-sta-gray">
    <div class="container">
      <production-banner
        class="pb-2 md:pb-8"
        :production="production"
        :show-buy-tickets-button="false"
        :show-detailed-info="false"
      />
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
  </div>
</template>

<script>
import Booking from '@/classes/Booking';
import PerformanceOverview from '@/components/booking/overview/PerformanceOverview.vue';
import TicketsOverview from '@/components/booking/overview/TicketsOverview.vue';
import UserOverview from '@/components/booking/overview/UserOverview.vue';
import VenueOverview from '@/components/booking/overview/VenueOverview.vue';
import ProductionBanner from '@/components/production/ProductionBanner.vue';

export default {
  name: 'ViewBooking',
  components: {
    VenueOverview,
    PerformanceOverview,
    UserOverview,
    TicketsOverview,
    ProductionBanner,
  },
  props: {},
  data() {
    return {
      booking: new Booking(),
      production: null,
    };
  },
  apollo: {
    booking: {
      query: require('@/graphql/queries/PaidBookingForPerformance.gql'),
      // variables: {
      //   bookingId: 1,
      // },
      result({ data }) {
        this.booking.updateFromAPIData(data.authUser.bookings.edges[0].node);
        this.production = this.booking.performance.production;
      },
    },
  },
};
</script>
