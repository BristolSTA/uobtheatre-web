<template>
  <div class="absolute -right-5 -top-3 z-10">
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
    <h3 v-else class="font-bold text-center">No tickets in booking</h3>
  </div>
  <BoxOfficeButton
    v-if="ticketsNotCheckedIn?.length"
    class="bg-sta-green hover:bg-sta-green-dark text-white"
    @click="
      ticketsNotCheckedIn ? emit('checkInTickets', ticketsNotCheckedIn) : null
    "
    >Check In Remaining
    {{ ticketsNotCheckedIn.length }} Tickets</BoxOfficeButton
  >
</template>

<script lang="ts" setup>
import type {
  IBookingHeaderProp,
  IBookingTicketsProp
} from '~~/components/box-office/BoxOfficeSharedTypes';

const props = defineProps<{
  booking: IBookingHeaderProp & { tickets?: IBookingTicketsProp[] | null };
}>();

const emit = defineEmits<{
  (event: 'selectTicket', ticket: IBookingTicketsProp): void;
  (event: 'checkInTickets', tickets: IBookingTicketsProp[]): void;
  (event: 'close'): void;
}>();

const ticketsNotCheckedIn = computed(() =>
  props.booking.tickets?.filter(
    (ticket: IBookingTicketsProp) => !ticket.checkedInAt
  )
);
</script>
