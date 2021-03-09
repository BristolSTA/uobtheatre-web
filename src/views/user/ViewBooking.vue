<template>
  <div class="min-h-full mb-10 text-white bg-sta-gray">
    <div v-if="booking.performance" class="container">
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

    <div class="mt-4 md:container">
      <div
        class="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-opacity-80 text-h2"
        :class="[expanded ? 'bg-sta-orange' : 'bg-sta-green']"
        @click="ticketToggle"
        @keypress="ticketToggle"
      >
        <h3 class="inline-block">View Tickets</h3>
        <font-awesome-icon :icon="expanded ? 'chevron-up' : 'chevron-down'" />
      </div>
      <div
        v-if="expanded"
        class="grid grid-cols-1 gap-4 px-4 py-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 bg-sta-gray-dark"
      >
        <ticket
          v-for="(ticket, index) in booking.tickets"
          :key="index"
          :booking="booking"
          :ticket="ticket"
          :user="$store.state.auth.user"
          :index="index + 1"
        />
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
import Ticket from '@/components/booking/Ticket.vue';
import ProductionBanner from '@/components/production/ProductionBanner.vue';
import { createClient } from '@/vue-apollo';

export default {
  name: 'ViewBooking',
  components: {
    VenueOverview,
    PerformanceOverview,
    TicketsOverview,
    ProductionBanner,
    PaymentOverview,
    Ticket,
  },
  data() {
    return {
      booking: new Booking(),
      user: null,
      expanded: false,
    };
  },
  metaInfo() {
    const production = this.production;
    return {
      title: production ? `Your booking for ${production.name}` : 'Loading...',
    };
  },
  async beforeRouteEnter(to, from, next) {
    const { apolloClient } = createClient();
    let { data } = await apolloClient.query({
      query: require('@/graphql/queries/UserPaidBooking.gql'),
      variables: {
        bookingId: to.params.bookingRef,
      },
    });

    if (!data.me.bookings.edges[0]) return next({ name: '404' });

    next((vm) => {
      vm.booking.updateFromAPIData(data.me.bookings.edges[0].node);
    });
  },
  computed: {
    production() {
      return this.booking.performance
        ? this.booking.performance.production
        : null;
    },
  },
  methods: {
    ticketToggle() {
      this.expanded = !this.expanded;
    },
  },
};
</script>
