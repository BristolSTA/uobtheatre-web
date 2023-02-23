<template>
  <div>
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
  </div>
</template>

<script lang="ts" setup>
import TicketOptions from '../TicketOptions.vue';
import Booking from '~~/classes/Booking';
import TicketsMatrix from '@/classes/TicketsMatrix';
import AllErrorsDisplay from '@/components/ui/AllErrorsDisplay.vue';
import Errors from '~~/classes/Errors';

withDefaults(
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
</script>
