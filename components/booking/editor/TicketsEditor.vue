<template>
  <div v-if="booking.performance" class="text-white">
    <div class="mb-2">
      <div class="p-2 bg-sta-gray-light text-center">
        <p class="text-h3">Selected Performance:</p>
        <p class="text-sta-orange">
          {{ booking.performance.start | dateFormat('cccc d MMM') }}, Starting
          at
          {{ booking.performance.start | dateFormat('T') }}
        </p>
      </div>
      <div v-if="performanceMinsAway < 15" class="bg-sta-rouge p-2 text-center">
        <h3 class="text-lg font-semibold">
          <font-awesome-icon icon="exclamation-triangle" /> Caution!
        </h3>
        <p v-if="performanceStarted">This performance has already started!</p>
        <p v-else>
          This performance starts in {{ performanceMinsAway }} minutes!
        </p>
      </div>
    </div>
    <div v-if="ticketsMatrix" class="space-y-1">
      <ticket-options
        :ticket-matrix="ticketsMatrix"
        :booking="booking"
        :show-capacities="showCapacities"
        :max-tickets="maxTickets"
        @request-update="$emit('change')"
      />
    </div>
    <all-errors-display
      :errors="errors"
      class="p-2 text-center bg-sta-gray-dark"
    />
    <div v-if="booking.tickets.length" class="flex my-4">
      <selected-tickets-table
        :ticket-matrix="ticketsMatrix"
        :booking="booking"
        :show-prices="showPrices"
      />
    </div>
  </div>
</template>

<script>
import TicketOptions from '../TicketOptions.vue';
import SelectedTicketsTable from '../SelectedTicketsTable.vue';
import Booking from '@/classes/Booking';
import TicketsMatrix from '@/classes/TicketsMatrix';
import AllErrorsDisplay from '@/components/ui/AllErrorsDisplay.vue';
import Errors from '@/classes/Errors';
export default defineNuxtComponent({
  components: { TicketOptions, AllErrorsDisplay, SelectedTicketsTable },
  props: {
    booking: {
      required: true,
      type: Booking
    },
    ticketsMatrix: {
      required: true,
      type: TicketsMatrix
    },
    showCapacities: {
      default: false,
      type: Boolean
    },
    errors: {
      default: null,
      type: Errors
    },
    showPrices: {
      default: true,
      type: Boolean
    },
    maxTickets: {
      default: null,
      type: Number
    }
  },
  computed: {
    performanceMinsAway() {
      const timeDiff = new Date(this.booking.performance.start) - Date.now();
      return Math.round(timeDiff / (1000 * 60));
    },
    performanceStarted() {
      return this.performanceMinsAway < 0;
    }
  }
});
</script>
