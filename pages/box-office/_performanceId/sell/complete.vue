<template>
  <div>
    <h2 class="text-h2">Booking Complete!</h2>
    <h3 class="text-gray-500 text-h3">Reference {{ booking.reference }}</h3>
    <div class="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
      <tickets-overview :booking="booking" />
      <payment-overview :booking="booking" />
    </div>

    <button
      class="font-semibold btn btn-orange"
      @click="goToMenu()"
      @keypress="goToMenu()"
    >
      Back to Menu
    </button>
  </div>
</template>

<script>
import Booking from '@/classes/Booking'
import TicketsOverview from '@/components/booking/overview/TicketsOverview.vue'
import PaymentOverview from '@/components/booking/overview/PaymentOverview.vue'
import CheckInTickets from '@/graphql/mutations/box-office/CheckInTickets.gql'
import { performMutation, errorToast, successToast } from '@/utils'
export default {
  components: { TicketsOverview, PaymentOverview },
  props: {
    booking: {
      required: true,
      type: Booking,
    },
  },
  async mounted() {
    if (!this.booking) return this.$router.push('/')
    try {
      await performMutation(
        this.$apollo,
        {
          mutation: CheckInTickets,
          variables: {
            reference: this.booking.reference,
            performanceId: this.booking.performance.id,
            tickets: this.booking.tickets.map((ticket) => {
              return {
                ticketId: ticket.id,
              }
            }),
          },
        },
        'checkInBooking'
      )
      successToast.fire({
        timer: 4000,
        title: 'Tickets automatically checked in',
      })
    } catch (e) {
      errorToast.fire({
        title: 'Unable to check in tickets automatically',
      })
    }
  },
  methods: {
    goToMenu() {
      this.$router.push(`/box-office/${this.booking.performance.id}`)
    },
  },
}
</script>
