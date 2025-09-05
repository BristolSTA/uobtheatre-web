<template>
  <div class="flex flex-none gap-2">
    <BoxOfficeBookingHeader
      :booking="booking"
      class="grow"
    /><PerformanceSummaryPill
      v-if="showPerformanceSummary && booking.performance"
      class="hidden md:flex"
      :class="[
        booking.performance.id !== queryPerformanceId
          ? 'text-sta-rouge'
          : 'text-white'
      ]"
      :performance="booking.performance"
    />
  </div>
  <div class="grow overflow-y-auto my-2">
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
import type { IdInput } from '~~/types/generic';
import type {
  IBookingHeaderProp,
  IBookingTicketProp,
  IPerformanceSummary
} from '../../../types/box-office';

const props = withDefaults(
  defineProps<{
    booking: IBookingHeaderProp & {
      tickets?: IBookingTicketProp[] | null;
      performance?: IPerformanceSummary & { id?: IdInput };
    };
    showTickets?: boolean;
    showPerformanceSummary?: boolean;
    allowMutations?: boolean;
    allowTicketInspections?: boolean;
    queryPerformanceId?: IdInput;
  }>(),
  {
    showTickets: true,
    showPerformanceSummary: false,
    allowMutations: true,
    allowTicketInspections: true,
    queryPerformanceId: undefined
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
