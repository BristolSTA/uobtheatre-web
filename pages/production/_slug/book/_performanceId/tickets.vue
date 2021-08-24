<template>
  <div v-if="booking.performance" class="text-white">
    <div class="p-2 mb-2 md:text-center bg-sta-gray-light">
      <p class="text-h3">Selected Performance:</p>
      <p class="text-sta-orange">
        {{ booking.performance.start | dateFormat('cccc d MMM') }}, Starting at
        {{ booking.performance.start | dateFormat('T') }}
      </p>
    </div>
    <div v-if="ticketMatrix" class="space-y-1">
      <ticket-options
        :ticket-matrix="ticketMatrix"
        :booking="booking"
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
        Next
      </button>
    </div>
  </div>
</template>

<script>
import lo from 'lodash'

import Booking from '@/classes/Booking'
import TicketMatrix from '@/classes/TicketsMatrix'
import AllErrorsDisplay from '@/components/ui/AllErrorsDisplay.vue'
import CreateBooking from '@/graphql/mutations/booking/CreateBooking.gql'
import UpdateBooking from '@/graphql/mutations/booking/UpdateBooking.gql'
import { performMutation } from '@/utils'
import TicketOptions from '@/components/booking/TicketOptions.vue'
import SelectedTicketsTable from '@/components/booking/SelectedTicketsTable.vue'

import BookingStage from '@/classes/BookingStage'
export default {
  stageInfo: new BookingStage({
    name: 'Ticket Selection',
    routeName: 'production-slug-book-performanceId-tickets',
  }),
  components: { TicketOptions, AllErrorsDisplay, SelectedTicketsTable },
  props: {
    production: {
      required: true,
      type: Object,
    },
    booking: {
      required: true,
      type: Booking,
    },
    ticketMatrix: {
      type: TicketMatrix,
      default: null,
    },
  },
  data() {
    return {
      interaction_timer: lo.debounce(this.updateAPI, 2 * 1000),
      errors: null,
    }
  },
  methods: {
    async updateAPI() {
      let bookingResponse
      try {
        if (!this.booking.id) {
          // We haven't got a booking yet, lets create one
          const data = await performMutation(
            this.$apollo,
            {
              mutation: CreateBooking,
              variables: {
                performanceId: this.booking.performance.id,
                tickets: this.booking.toAPIData().tickets,
              },
            },
            'createBooking'
          )
          bookingResponse = data.createBooking.booking
        } else {
          // We have a booking, lets update it
          const data = await performMutation(
            this.$apollo,
            {
              mutation: UpdateBooking,
              variables: {
                id: this.booking.id,
                tickets: this.booking.toAPIData().tickets,
              },
            },
            'updateBooking'
          )
          bookingResponse = data.updateBooking.booking
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
