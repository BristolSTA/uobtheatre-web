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

      <div class="mt-4">
        <div
          ref="header"
          class="flex py-2 pl-4 cursor-pointer hover:bg-opacity-80"
          :class="[expanded ? 'bg-sta-orange' : 'bg-sta-green']"
          @click="ticketToggle"
          @keypress="ticketToggle"
        >
          <div class="flex-grow">
            <h3 class="inline-block text-h3 lg:text-h2">Tickets</h3>
          </div>
          <div class="flex items-center pr-4 text-3xl">
            <font-awesome-icon
              :icon="expanded ? 'chevron-up' : 'chevron-down'"
            />
          </div>
        </div>
        <div v-if="expanded" class="p-4 bg-sta-gray-dark">
          <div class="flex justify-center w-full space-x-4">
            <ticket
              v-for="(ticket, index) in booking.tickets"
              :key="index"
              :booking="booking"
              :ticket="ticket"
              :user="user"
            />
          </div>
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
  apollo: {
    booking: {
      query: require('@/graphql/queries/PaidBookingForPerformance.gql'),
      // variables: {
      //   bookingId: 1,
      // },
      result({ data }) {
        this.user = (({ firstName, lastName, email }) => ({
          firstName,
          lastName,
          email,
        }))(data.authUser);
        this.booking.updateFromAPIData(data.authUser.bookings.edges[0].node);
        this.production = this.booking.performance.production;
      },
    },
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
