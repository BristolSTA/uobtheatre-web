<template>
  <div class="min-h-full mb-10 text-white bg-sta-gray">
    <div class="bg-sta-gray-light">
      <div class="container">
        <breadcrumbs :crumbs="crumbs" />
      </div>
    </div>
    <div v-if="booking.performance" class="container">
      <h1 class="pt-2 text-h1">Your Booking</h1>
      <h2 class="text-h2 text-sta-orange">
        Reference - {{ booking.reference }}
      </h2>
      <production-banner
        class="pb-2 md:pb-8"
        :production="production"
        :show-buy-tickets-button="false"
        :show-detailed-info="false"
      />
      <div class="w-full text-center lg:hidden">
        <button
          id="ticket-jump"
          class="p-2 py-1 m-1 btn"
          @click="jumpToTickets"
          @keypress="jumpToTickets"
        >
          Jump to tickets <font-awesome-icon icon="chevron-down" />
        </button>
      </div>

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
          ref="tickets"
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
  </div>
</template>

<script>
import Booking from '@/classes/Booking'
import PaymentOverview from '@/components/booking/overview/PaymentOverview.vue'
import PerformanceOverview from '@/components/booking/overview/PerformanceOverview.vue'
import TicketsOverview from '@/components/booking/overview/TicketsOverview.vue'
import VenueOverview from '@/components/booking/overview/VenueOverview.vue'
import Ticket from '@/components/booking/Ticket.vue'
import ProductionBanner from '@/components/production/ProductionBanner.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'

export default {
  components: {
    VenueOverview,
    PerformanceOverview,
    TicketsOverview,
    ProductionBanner,
    PaymentOverview,
    Ticket,
    Breadcrumbs,
  },
  async asyncData({ app, params, error }) {
    const { data } = await app.apolloProvider.defaultClient.query({
      query: require('@/graphql/queries/UserPaidBooking.gql'),
      variables: {
        bookingRef: params.reference,
      },
    })

    if (!data.me.bookings.edges[0])
      return error({
        statusCode: 404,
        message: 'This booking does not exists',
      })

    return {
      booking: Booking.fromAPIData(data.me.bookings.edges[0].node),
    }
  },
  data() {
    return {
      booking: null,
      user: null,
      expanded: false,
    }
  },
  head() {
    const production = this.production
    return {
      title: production ? `Booking for ${production.name}` : 'Loading...',
    }
  },
  computed: {
    production() {
      return this.booking.performance
        ? this.booking.performance.production
        : null
    },
    crumbs() {
      return [
        { text: 'My Account', route: '/user' },
        { text: 'Booking Details' },
      ]
    },
  },
  methods: {
    ticketToggle() {
      this.expanded = !this.expanded
    },
    jumpToTickets() {
      this.expanded = true
      this.$refs.tickets.scrollIntoView()
    },
  },
}
</script>
