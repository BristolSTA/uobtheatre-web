<template>
  <div class="min-h-full mb-10 text-white bg-sta-gray">
    <div class="container">
      <h1 class="pt-2 text-left text-h1">Booking Info</h1>
      <production-banner
        class="pb-2 md:pb-8"
        :production="production"
        :show-buy-tickets-button="false"
        :show-detailed-info="false"
      />
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <performance-overview
          class="lg:col-span-2"
          :production="production"
          :performance="booking.performance"
        />
        <venue-overview
          class="lg:col-span-1"
          :venue-data="booking.performance.venue.slug"
          :online="booking.performance.isOnline"
          :in-person="booking.performance.isInperson"
        />

        <payment-overview class="lg:col-span-1" :booking="booking" />
        <tickets-overview class="lg:col-span-2" :booking="booking" />
      </div>
    </div>
  </div>
</template>

<script>
import Booking from '@/classes/Booking';
import PaymentOverview from '@/components/booking/overview/PaymentOverview.vue';
import PerformanceOverview from '@/components/booking/overview/PerformanceOverview.vue';
import TicketsOverview from '@/components/booking/overview/TicketsOverview.vue';
import VenueOverview from '@/components/booking/overview/VenueOverview.vue';
import ProductionBanner from '@/components/production/ProductionBanner.vue';

export default {
  name: 'ViewBooking',
  components: {
    VenueOverview,
    PerformanceOverview,
    TicketsOverview,
    ProductionBanner,
    PaymentOverview,
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
