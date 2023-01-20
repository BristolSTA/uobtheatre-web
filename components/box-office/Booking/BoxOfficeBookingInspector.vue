<template>
  <div class="absolute -right-1 -top-1 z-10">
    <font-awesome-icon
      icon="times-circle"
      class="text-white text-xl hover:text-gray-400 cursor-pointer"
      @click="emit('close')"
    />
  </div>
  <BoxOfficeBookingHeader :booking="booking" class="flex-none" />
  <div class="flex-grow overflow-y-auto my-2">
    <BoxOfficeBookingTickets
      v-if="booking.tickets"
      :tickets="booking.tickets"
      class="w-full text-white"
      @select-ticket="emit('selectTicket', $event)"
    />
    <h3 class="font-bold text-center">No tickets in booking</h3>
  </div>
  <BoxOfficeButton class="bg-sta-green hover:bg-sta-green-dark text-white"
    >Check In Remaining 4 Tickets</BoxOfficeButton
  >
</template>

<script lang="ts" setup>
import type { IBookingHeader } from '@/components/box-office/Booking/BoxOfficeBookingHeader.vue';
const props = defineProps<{
  booking: IBookingHeader;
}>();
const emit = defineEmits<{
  (event: 'selectTicket', ticket: any): void; //TODO: don't use any
  (event: 'close'): void;
}>();
</script>
