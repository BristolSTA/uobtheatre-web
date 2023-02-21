<template>
  <div v-if="booking.performance" class="text-white">
    <div class="mb-2">
      <div class="p-2 bg-sta-gray-light text-center">
        <p class="text-h3">Selected Performance:</p>
        <p class="text-sta-orange">
          {{ dateFormat(booking.performance.start, 'cccc d MMM') }}, Starting at
          {{ dateFormat(booking.performance.start, 'T') }}
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
        @request-update="emit('change')"
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

<script lang="ts" setup>
import TicketOptions from '../TicketOptions.vue';
import SelectedTicketsTable from '../SelectedTicketsTable.vue';
import Booking from '~~/classes/Booking';
import TicketsMatrix from '@/classes/TicketsMatrix';
import AllErrorsDisplay from '@/components/ui/AllErrorsDisplay.vue';
import Errors from '~~/classes/Errors';

const props = withDefaults(
  defineProps<{
    booking: Booking;
    ticketsMatrix: TicketsMatrix;
    showCapacities?: boolean;
    errors?: Errors;
    showPrices?: boolean;
    maxTickets?: number;
  }>(),
  {
    showCapacities: false,
    errors: undefined,
    showPrices: true,
    maxTickets: undefined
  }
);

const emit = defineEmits<{
  (event: 'change'): void;
}>();

const performanceMinsAway = computed(() => {
  const timeDiff =
    new Date(props.booking.performance.start).valueOf() - Date.now();
  return Math.round(timeDiff / (1000 * 60));
});

const performanceStarted = computed(() => performanceMinsAway.value < 0);
</script>
