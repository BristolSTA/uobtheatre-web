<template>
  <div class="flex flex-none gap-2">
    <BoxOfficeBookingHeader
      :booking="booking"
      class="flex-grow"
    /><PerformanceSummaryPill
      v-if="showPerformanceSummary && booking.performance"
      class="text-white hidden md:flex"
      :performance="booking.performance"
    />
  </div>
  <div class="flex-grow overflow-y-auto my-2">
    <BoxOfficeBookingTickets
      v-if="showTickets && booking.tickets"
      :tickets="booking.tickets"
      :allow-inspection="allowTicketInspections"
      class="w-full text-white"
      @select-ticket="emit('selectTicket', $event)"
    />
    <h3 v-else class="font-bold text-center">No tickets in booking</h3>
  </div>
  <BoxOfficeBookingCheckInButton
    v-if="allowMutations && ticketsNotCheckedIn?.length"
    :check-in="true"
    :number="ticketsNotCheckedIn.length"
    @check-in="
      ticketsNotCheckedIn
        ? emit('checkInTickets', {
            tickets: ticketsNotCheckedIn,
            callback: $event
          })
        : null
    "
  />
</template>

<script lang="ts" setup>
import {
  IBookingHeaderProp,
  IBookingTicketProp,
  IPerformanceSummary
} from '../BoxOfficeSharedTypes';

const props = withDefaults(
  defineProps<{
    booking: IBookingHeaderProp & {
      tickets?: IBookingTicketProp[] | null;
      performance?: IPerformanceSummary;
    };
    showTickets?: boolean;
    showPerformanceSummary?: boolean;
    allowMutations?: boolean;
    allowTicketInspections?: boolean;
  }>(),
  {
    showTickets: true,
    showPerformanceSummary: false,
    allowMutations: true,
    allowTicketInspections: true
  }
);

const emit = defineEmits<{
  (
    event: 'checkInTickets',
    payload: { tickets: IBookingTicketProp[]; callback: () => void }
  ): void;
  (event: 'selectTicket', ticket: IBookingTicketProp): void;
}>();

const ticketsNotCheckedIn = computed(
  () =>
    props.booking.tickets?.filter(
      (ticket) => !ticket.checkedInAt
    ) as IBookingTicketProp[]
);
</script>
