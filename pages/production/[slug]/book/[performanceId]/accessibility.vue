<template>
  <div v-if="booking.performance && ticketMatrix" class="text-white">
    <div class="mb-4">
      <VenueAccessibility :venue-data="booking.performance.venue.slug" />
    </div>
    <div class="mb-4">
      <AccessibilityInput :booking="booking" />
    </div>
    <div v-if="booking.tickets.length" class="mt-2 text-center">
      <button
        class="btn btn-orange font-semibold"
        :disabled="booking.dirty"
        @click="
          updateAPI();
          $emit('next-stage');
        "
        @keypress="
          updateAPI();
          $emit('next-stage');
        "
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
import AccessibilityInput from '@/components/booking/AccessibilityInput.vue';
import VenueAccessibility from '@/components/venue/VenueAccessibility.vue';
import { recordEvent, events } from '~~/utils/analytics';
const stageInfo = new BookingStage({
  name: 'Accessibility Information',
  routeName: 'production-slug-book-performanceId-accessibility',
  eligable: (_, booking) => !booking.dirty && booking.tickets.length > 0
});

export default defineNuxtComponent({
  stageInfo,
  components: {
    AccessibilityInput,
    VenueAccessibility
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
  emits: ['next-stage', 'mounted'],
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
                  tickets: this.booking.toAPIData().tickets,
                  accessibilityInfo: this.booking.accessibilityInfo
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
                  tickets: this.booking.toAPIData().tickets,
                  accessibilityInfo: this.booking.accessibilityInfo
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
