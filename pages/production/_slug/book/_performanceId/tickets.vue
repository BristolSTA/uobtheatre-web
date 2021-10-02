<template>
  <div v-if="booking.performance" class="text-white">
    <tickets-editor
      :tickets-matrix="ticketMatrix"
      :booking="booking"
      @change="updateApi"
    />
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
import CreateBooking from '@/graphql/mutations/booking/CreateBooking.gql'
import UpdateBooking from '@/graphql/mutations/booking/UpdateBooking.gql'
import { performMutation } from '@/utils'

import BookingStage from '@/classes/BookingStage'
import TicketsEditor from '@/components/booking/editor/TicketsEditor.vue'
export default {
  stageInfo: new BookingStage({
    name: 'Ticket Selection',
    routeName: 'production-slug-book-performanceId-tickets',
  }),
  components: {
    TicketsEditor,
  },
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
