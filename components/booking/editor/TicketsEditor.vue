<template>
  <div v-if="booking.performance" class="text-white">
    <div class="p-2 mb-2 md:text-center bg-sta-gray-light">
      <p class="text-h3">Selected Performance:</p>
      <p class="text-sta-orange">
        {{ booking.performance.start | dateFormat('cccc d MMM') }}, Starting at
        {{ booking.performance.start | dateFormat('T') }}
      </p>
    </div>
    <div v-if="ticketsMatrix" class="space-y-1">
      <ticket-options
        :ticket-matrix="ticketsMatrix"
        :booking="booking"
        :show-capacities="showCapacities"
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
import Booking from '@/classes/Booking'
import TicketsMatrix from '@/classes/TicketsMatrix'
import AllErrorsDisplay from '@/components/ui/AllErrorsDisplay.vue'
import Errors from '@/classes/Errors'
import TicketOptions from '../TicketOptions.vue'
import SelectedTicketsTable from '../SelectedTicketsTable.vue'
export default {
  components: { TicketOptions, AllErrorsDisplay, SelectedTicketsTable },
  props: {
    booking: {
      required: true,
      type: Booking,
    },
    ticketsMatrix: {
      required: true,
      type: TicketsMatrix,
    },
    showCapacities: {
      default: false,
      type: Boolean,
    },
    errors: {
      default: null,
      type: Errors,
    },
    showPrices: {
      default: true,
      type: Boolean,
    },
  },
}
</script>
