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
          Proceed to Payment
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import lo from 'lodash'
import Booking from '@/classes/Booking'
import TicketOptions from '@/components/booking/TicketOptions.vue'
import SelectedTicketsTable from '@/components/booking/SelectedTicketsTable.vue'
import AllErrorsDisplay from '@/components/ui/AllErrorsDisplay.vue'
import CreateBooking from '@/graphql/mutations/booking/CreateBooking.gql'
import UpdateBooking from '@/graphql/mutations/booking/UpdateBooking.gql'
import { performMutation } from '@/utils'
import TicketsMatrix from '@/classes/TicketsMatrix'

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
        { text: 'Box Office', path: '/box-office' },
        {
          text: `${this.performance.production.name} on day X`,
          path: `/box-office/${this.performance.id}`,
        },
        {
          text: 'Sell Tickets',
        },
      ]
    },
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
