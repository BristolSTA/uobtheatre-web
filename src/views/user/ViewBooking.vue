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

    <div class="mt-4 md:container">
      <div
        ref="header"
        class="flex py-2 pl-4 cursor-pointer hover:bg-opacity-80"
        :class="[expanded ? 'bg-sta-orange' : 'bg-sta-green']"
        @click="ticketToggle"
        @keypress="ticketToggle"
      >
        <div class="flex-grow">
          <h3 class="inline-block text-h2">View Tickets</h3>
        </div>
        <div class="flex items-center pr-4 text-h2">
          <font-awesome-icon :icon="expanded ? 'chevron-up' : 'chevron-down'" />
        </div>
      </div>
      <div
        v-if="expanded"
        class="flex justify-center w-full py-4 md:px-4 bg-sta-gray-dark"
      >
        <div
          class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        >
          <ticket
            v-for="(ticket, index) in booking.tickets"
            :key="index"
            :booking="booking"
            :ticket="ticket"
            :user="user"
            :index="index"
          />
        </div>
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
  props: {},
  data() {
    return {
      booking: new Booking(),
      production: null,
      user: null,
      expanded: false,
    };
  },
  beforeRouteEnter(to, from, next) {
    const { apolloClient } = createClient();
    return apolloClient
      .query({
        query: require('@/graphql/queries/UserPaidBooking.gql'),
        variables: {
          bookingId: to.params.bookingRef,
        },
      })
      .then(({ data }) => {
        next((vm) => {
          vm.user = (({ firstName, lastName, email }) => ({
            firstName,
            lastName,
            email,
          }))(data.authUser);
          //$store.state.auth.user.firstName
          vm.booking.updateFromAPIData(data.authUser.bookings.edges[0].node);
          vm.production = vm.booking.performance.production;
        });
      });
  },
  methods: {
    ticketToggle() {
      if (this.expanded) {
        this.expanded = false;
      } else {
        this.expanded = true;
      }
    },
  },
};
</script>
