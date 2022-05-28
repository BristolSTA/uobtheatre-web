<template>
  <div v-if="booking.reference">
    <box-office-navigation :performance="booking.performance" />

    <h2 class="text-h2">Booking Complete!</h2>
    <h3 class="text-gray-500 text-h3">Reference {{ booking.reference }}</h3>
    <div class="grid gap-4 grid-cols-1 mb-6 md:grid-cols-2">
      <tickets-overview :booking="booking" />
      <payment-overview :booking="booking" />
    </div>
    <div class="flex justify-center mb-2">
      <div>
        <button
          v-if="!checkedIn"
          class="btn btn-green font-semibold animate-pulse animate w-30"
          @click="checkInTickets()"
          @keypress="checkInTickets()"
        >
          Check In Tickets
        </button>
        <button v-if="checkedIn" class="btn btn-outline disabled w-30" disabled>
          Tickets Checked In
        </button>
        <button
          class="btn btn-orange font-semibold"
          @click="goToMenu()"
          @keypress="goToMenu()"
        >
          Back to Menu
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Booking from '@/classes/Booking'
import TicketsOverview from '@/components/booking/overview/TicketsOverview.vue'
import PaymentOverview from '@/components/booking/overview/PaymentOverview.vue'
import CheckInTickets from '@/graphql/mutations/box-office/CheckInTickets.gql'
import { performMutation, errorToast, successToast } from '@/utils'
import BoxOfficeNavigation from '@/components/box-office/BoxOfficeNavigation.vue'
export default {
  components: { TicketsOverview, PaymentOverview, BoxOfficeNavigation },
  props: {
    booking: {
      required: true,
      type: Booking,
    },
  },
  data() {
    return {
      checkedIn: false,
    }
  },
  mounted() {
    if (!this.booking.reference) return this.$router.push('../')
  },
  beforeDestroy() {
    // Remove stored booking ID
    this.$store.commit('box-office/SET_IN_PROGRESS_BOOKING_ID', null)
  },
  methods: {
    async checkInTickets() {
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
        this.checkedIn = true
        successToast.fire({
          timer: 4000,
          title: 'Tickets checked in',
        })
      } catch (e) {
        errorToast.fire({
          title: 'Unable to check in tickets',
        })
      }
    },
    goToMenu() {
      this.$router.push(`/box-office/${this.booking.performance.id}`)
    },
  },
}
</script>
