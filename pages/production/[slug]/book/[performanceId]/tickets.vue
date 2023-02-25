<template>
  <div v-if="booking.performance && ticketMatrix" class="text-white">
    <BookingSelectedPerformanceBar
      v-if="booking.performance"
      :performance="booking.performance"
    />
    <tickets-editor
      :tickets-matrix="ticketMatrix"
      :booking="booking"
      :max-tickets="10"
      :errors="errors"
      @change="updateAPI"
    />
    <div
      v-if="booking.tickets.length"
      class="mt-2 min-w-1/2 text-center border-4 border-dashed border-sta-gray rounded-md text-white"
    >
      <h2 class="text-h2">Selected Tickets</h2>

      <BookingSelectedTicketsTable
        :ticket-matrix="ticketMatrix"
        :booking="booking"
      />
    </div>
    <div v-if="booking.tickets.length" class="mt-2 text-center">
      <button
        class="btn btn-orange font-semibold"
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
import lo from 'lodash';

import Booking from '~~/classes/Booking';
import TicketMatrix from '~~/classes/TicketsMatrix';
import BookingMutation from '@/graphql/mutations/booking/Booking.gql';
import { getValidationErrors, performMutation } from '~~/utils/api';

import BookingStage from '@/classes/BookingStage';
import TicketsEditor from '@/components/booking/editor/TicketsEditor.vue';
import { recordEvent, events } from '~~/utils/analytics';
const stageInfo = new BookingStage({
  name: 'Ticket Selection',
  routeName: 'production-slug-book-performanceId-tickets'
});

export default defineNuxtComponent({
  stageInfo,
  components: {
    TicketsEditor
  },
  props: {
    production: {
      required: true,
      type: Object
    },
    booking: {
      required: true,
      type: Booking
    },
    ticketMatrix: {
      type: TicketMatrix,
      default: null
    }
  },
  data() {
    return {
      interaction_timer: lo.debounce(this.updateAPI, 2 * 1000),
      errors: null
    };
  },
  mounted() {
    this.$emit('mounted', stageInfo);
  },
  methods: {
    async updateAPI() {
      let bookingResponse;
      try {
        if (!this.booking.id) {
          // We haven't got a booking yet, lets create one
          const data = await performMutation(
            this.$apollo,
            {
              mutation: BookingMutation,
              variables: {
                input: {
                  performance: this.booking.performance.id,
                  tickets: this.booking.toAPIData().tickets
                }
              }
            },
            'booking'
          );
          bookingResponse = data.booking.booking;
          recordEvent(events.booking.started);
        } else {
          // We have a booking, lets update it
          const data = await performMutation(
            this.$apollo,
            {
              mutation: BookingMutation,
              variables: {
                input: {
                  id: this.booking.id,
                  tickets: this.booking.toAPIData().tickets
                }
              }
            },
            'booking'
          );
          bookingResponse = data.booking.booking;
        }
      } catch (e) {
        this.errors = getValidationErrors(e);
        return;
      }

      // Check for changes since API called.
      if (this.booking.tickets.length === bookingResponse.tickets.length) {
        return this.booking.updateFromAPIData(bookingResponse);
      }

      // There has been a change in the selected tickets whilst calling the API. Let's trigger another call...
      this.interaction_timer();
    }
  }
});
</script>
