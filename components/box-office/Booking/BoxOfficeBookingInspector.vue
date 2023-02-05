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
  <BoxOfficeBookingCheckInButton
    v-if="ticketsNotCheckedIn?.length"
    :check-in="true"
    :number="ticketsNotCheckedIn.length"
    @check-in="
      ticketsNotCheckedIn
        ? emit(
            'checkInTickets',
            ticketsNotCheckedIn as AtLeastOneOf<IBookingTicketProp>
          )
        : null
    "
  />
</template>

<script lang="ts" setup>
import type {
  IBookingHeaderProp,
  IBookingTicketProp
} from '~~/components/box-office/BoxOfficeSharedTypes';
import { AtLeastOneOf } from '~~/types/generic';

const props = defineProps<{
  booking: IBookingHeaderProp & { tickets?: IBookingTicketProp[] | null };
}>();

const emit = defineEmits<{
  (event: 'selectTicket', ticket: IBookingTicketProp): void;
  (event: 'checkInTickets', tickets: AtLeastOneOf<IBookingTicketProp>): void;
  (event: 'close'): void;
}>();

const ticketsNotCheckedIn = computed(() =>
  props.booking.tickets?.filter(
    (ticket: IBookingTicketProp) => !ticket.checkedInAt
  )
);
</script>
