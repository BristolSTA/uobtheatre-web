<template>
  <div>
    <div class="my-2 p-2 text-white bg-sta-gray-dark">
      <p class="text-center font-semibold">
        {{ ticketMatrix.performanceCapacityRemaining }} tickets available
      </p>
      <tickets-editor
        :booking="booking"
        :tickets-matrix="ticketMatrix"
        :show-capacities="true"
        :errors="errors"
        @change="updateAPI"
      />
      <div v-if="booking.tickets.length" class="mt-2 text-center">
        <button
          class="btn btn-orange font-semibold"
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
import CreateBooking from '@/graphql/mutations/booking/CreateBooking.gql'
import UpdateBooking from '@/graphql/mutations/booking/UpdateBooking.gql'
import { performMutation } from '@/utils'
import TicketsMatrix from '@/classes/TicketsMatrix'
import TicketsEditor from '@/components/booking/editor/TicketsEditor.vue'

export default {
  components: {
    TicketsEditor,
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

      // Update booking ID in store
      this.$store.commit(
        'box-office/SET_IN_PROGRESS_BOOKING_ID',
        bookingResponse.id
      )

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
