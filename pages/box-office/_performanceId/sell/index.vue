<template>
  <div>
    <div class="p-2 my-2 text-white bg-sta-gray-dark">
      <div class="space-y-1">
        <p class="font-semibold text-center">
          {{ ticketMatrix.performanceCapacityRemaining }} tickets available
        </p>
        <ticket-options
          :ticket-matrix="ticketMatrix"
          :booking="booking"
          :show-capacities="true"
          @request-update="updateAPI"
        />
      </div>
      <all-errors-display
        :errors="errors"
        class="p-2 text-center bg-sta-gray-dark"
      />
      <div v-if="booking.tickets.length" class="flex my-4">
        <selected-tickets-table
          :ticket-matrix="ticketMatrix"
          :booking="booking"
        />
      </div>
      <div v-if="booking.tickets.length" class="mt-2 text-center">
        <button
          class="font-semibold btn btn-orange"
          :disabled="booking.dirty"
          @click="$emit('next-stage')"
          @keypress="$emit('next-stage')"
        >
          Pay Now
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import lo from 'lodash'
import Booking from '@/classes/Booking'
import TicketsMatrix from '@/classes/TicketsMatrix'
import TicketOptions from '@/components/booking/TicketOptions.vue'
import SelectedTicketsTable from '@/components/booking/SelectedTicketsTable.vue'
import AllErrorsDisplay from '@/components/ui/AllErrorsDisplay.vue'
import PriceBreakdownFragment from '@/graphql/fragments/booking/AllPriceBreakdown.gql'
import DetailBookingFragment from '@/graphql/fragments/booking/DetailedBookingDetails.gql'
import ErrorsPartial from '@/graphql/partials/ErrorsPartial'
import { performMutation } from '@/utils'
import FakeBooking from '@/tests/unit/fixtures/instances/FullBooking'
import gql from 'graphql-tag'

export default {
  components: {
    TicketOptions,
    SelectedTicketsTable,
    AllErrorsDisplay,
  },
  props: {
    booking: {
      required: true,
      type: Booking,
    },
    ticketMatrix: {
      required: true,
      type: TicketsMatrix,
    },
    performance: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      selected_location_index: null,

      interaction_timer: lo.debounce(this.updateAPI, 2 * 1000),
      errors: null,
    }
  },
  computed: {
    crumbs() {
      return [
        { text: 'Box Office', route: '/box-office' },
        {
          text: `${this.performance.production.name} on day X`,
          route: `/box-office/${this.performance.id}`,
        },
        {
          text: 'Sell Tickets',
        },
      ]
    },
  },
  methods: {
    async updateAPI() {
      // TODO: Implement here when API is ready

      // eslint-disable-next-line vue/no-mutating-props
      this.booking.updateFromAPIData(FakeBooking())
      return
      // eslint-disable-next-line no-unreachable
      const queryBody = `
        ${ErrorsPartial}
        booking {
          ...DetailedBookingDetails
        }`

      const variables = {
        id: this.booking.id,
        performanceID: this.booking.performance.id,
        tickets: this.booking.toAPIData().tickets,
      }

      let bookingResponse
      try {
        if (!this.booking.id) {
          // We haven't got a booking yet, lets create one
          const data = await performMutation(
            this.$apollo,
            {
              mutation: gql`
            mutation($performanceID: IdInputField!, $tickets: [CreateTicketInput]) {
              createBoxOfficeBooking(performanceId: $performanceID, tickets: $tickets) {
                ${queryBody}
              }
            }
            ${PriceBreakdownFragment}
            ${DetailBookingFragment}
          `,
              variables,
            },
            'createBoxOfficeBooking'
          )
          bookingResponse = data.createBoxOfficeBooking.booking
        } else {
          // We have a booking, lets update it
          const data = await performMutation(
            this.$apollo,
            {
              mutation: gql`
            mutation($id: IdInputField!, $tickets: [UpdateTicketInput]) {
              updateBoxOfficeBooking(bookingId: $id, tickets: $tickets) {
                ${queryBody}
              }
            }
            ${PriceBreakdownFragment}
            ${DetailBookingFragment}
          `,
              variables,
            },
            'updateBoxOfficeBooking'
          )
          bookingResponse = data.updateBoxOfficeBooking.booking
        }
      } catch ({ errors }) {
        this.errors = errors
        return
      }

      // Check for changes since API called.
      if (this.booking.tickets.length === bookingResponse.tickets.length) {
        return this.booking.updateFromAPIData(bookingResponse)
      }

      // There has been a change in the selected tickets whilst calling the API. Let's trigger another call...
      this.interaction_timer()
    },
  },
}
</script>
