<template>
  <div
    class="w-full md:w-1/3"
    :class="{ 'hidden md:block': !inspectedObjects.ticket }"
  >
    <div
      v-if="inspectedObjects.ticket"
      class="h-full relative overflow-y-auto bg-sta-gray-dark rounded-xl px-5 py-3 flex flex-col"
    >
      <div class="absolute right-0 top-0 z-10">
        <font-awesome-icon
          icon="times-circle"
          class="text-white text-xl hover:text-gray-400 cursor-pointer"
          @click="inspectedObjects.ticket = undefined"
        />
      </div>
      <BoxOfficeBookingTicketDetailsHeader />
      <BoxOfficeBookingTicketDetails
        class="grow"
        :ticket="inspectedObjects!.ticket"
        :allow-check-in="allowMutations"
        @check-in="
          inspectedObjects.booking
            ? checkInTickets(
                inspectedObjects.booking.reference,
                [$event.ticket.id],
                $event.asyncCompleteCallback
              )
            : null
        "
        @un-check-in="
          inspectedObjects.booking
            ? unCheckInTickets(
                inspectedObjects.booking.reference,
                [$event.ticket.id],
                $event.asyncCompleteCallback
              )
            : null
        "
      />
    </div>
  </div>

  <div
    class="grow bg-sta-gray-dark rounded-xl p-2 md:px-5 py-3 flex-col relative w-full"
    :class="[inspectedObjects.ticket ? 'hidden md:flex' : 'flex']"
  >
    <div class="absolute right-0 top-0 z-10">
      <font-awesome-icon
        v-if="inspectedObjects.booking && allowBookingClose"
        icon="times-circle"
        class="text-white text-xl hover:text-gray-400 cursor-pointer"
        @click="inspectedObjects.booking = undefined"
      />
    </div>
    <UiLoadingContainer
      class="h-full"
      :loading="loadingBookings || loadingBooking"
      :hide-content-when-loading="true"
    >
      <div class="overflow-y-auto flex flex-col h-full">
        <BoxOfficeBookingList
          v-if="!inspectedObjects.booking"
          :bookings="bookings"
          :pagination-info="bookingsPageInfo"
          @select="
            selectBooking($event as NonNullable<typeof bookings>[number])
          "
          @update:offset="$emit('update:bookingsOffset', $event)"
        />
        <template v-else>
          <BoxOfficeBookingDetails
            :booking="inspectedObjects.booking"
            :allow-mutations="allowMutations"
            :show-performance-summary="
              showPerformanceSummary ||
              (showPerformanceSummaryIfDifferent &&
                inspectedObjects.booking.performance.id !== performanceId)
            "
            :allow-ticket-inspections="allowTicketInspections"
            :query-performance-id="performanceId"
            @select-ticket="selectTicket($event)"
            @check-in-tickets="
              inspectedObjects.booking
                ? checkInTickets(
                    inspectedObjects.booking.reference,
                    $event.tickets.map(
                      // @ts-ignore
                      (ticket) => ticket.id
                    ),
                    $event.callback
                  )
                : null
            "
          />
        </template>
      </div>
    </UiLoadingContainer>
  </div>
</template>

<script lang="ts" setup>
import type {
  IDetailedBooking,
  IDetailedBookingTicket,
  ISimpleBooking
} from '~~/types/box-office';
import { mutateTicketCheckInState as mutateTicketCheckInStateOperation } from '~~/services/ticketScanService';
import {
  BoxOfficePerformanceBookingDocument,
  type BoxOfficePerformanceBookingQuery,
  type BoxOfficePerformanceBookingQueryVariables
} from '~~/graphql/codegen/operations';
import type { IdInput, PaginationInfo } from '~~/types/generic';

// Props

const props = withDefaults(
  defineProps<{
    performanceId: string;
    loadingBookings: boolean;
    bookings?: ISimpleBooking[];
    bookingsPageInfo?: PaginationInfo;
    allowBookingClose?: boolean;
    allowMutations?: boolean;
    allowTicketInspections?: boolean;
    showPerformanceSummary?: boolean;
    showPerformanceSummaryIfDifferent?: boolean;

    selectedTicket?: { id: string };
    selectedBooking?: IDetailedBooking;
  }>(),
  {
    allowBookingClose: true,
    allowMutations: true,
    allowTicketInspections: true,
    showPerformanceSummary: false,
    showPerformanceSummaryIfDifferent: true,
    bookings: undefined,
    bookingsPageInfo: undefined,
    selectedTicket: undefined,
    selectedBooking: undefined
  }
);

// Data
const loadingBooking = ref(false);
const inspectedObjects = reactive<{
  booking?: IDetailedBooking;
  ticket?: IDetailedBookingTicket;
}>({
  booking: props.selectedBooking,
  ticket: props.selectedBooking?.tickets?.find(
    (ticket) => ticket.id === props.selectedTicket?.id
  )
});

// Events
const emit = defineEmits<{
  (event: 'checkedIn', message?: string): void;
  (event: 'unCheckedIn', message?: string): void;
  (event: 'checkInError', error: string): void;
  (event: 'startingCheckIn'): void;
  (event: 'update:selectedBooking', booking?: IDetailedBooking): void;
  (event: 'update:selectedTicket', ticket?: IDetailedBookingTicket): void;
  (event: 'update:bookingsOffset', offset: number): void;
}>();

// Watchers
watch(
  () => props.selectedBooking,
  (newValue) => {
    inspectedObjects.booking = newValue;
  }
);

watch(
  () => props.selectedTicket,
  () => {
    inspectedObjects.ticket = props.selectedBooking?.tickets?.find(
      (ticket) => ticket.id === props.selectedTicket?.id
    );
  }
);

watch(
  () => inspectedObjects.booking,
  (newValue) => {
    emit('update:selectedBooking', newValue);
    if (!newValue) inspectedObjects.ticket = undefined;
  }
);

watch(
  () => inspectedObjects.ticket,
  (newValue) => {
    emit('update:selectedTicket', newValue);
  }
);

// When the user selects a ticket
function selectTicket(selectedTicket: { id: string }) {
  inspectedObjects.ticket =
    inspectedObjects.booking!.tickets!.find(
      (ticket) => ticket.id == selectedTicket.id
    ) || undefined;
}

// When the user selects a booking
async function selectBooking(booking: ISimpleBooking) {
  if (!performance)
    return errorHandler(
      'No performance was available when running selectBooking'
    );
  loadingBooking.value = true;
  const { data } = await useAsyncQuery<BoxOfficePerformanceBookingQuery>({
    query: BoxOfficePerformanceBookingDocument,
    variables: {
      performanceId: props.performanceId,
      bookingId: booking.id
    } satisfies BoxOfficePerformanceBookingQueryVariables
  });
  loadingBooking.value = false;

  inspectedObjects.booking =
    data.value?.performance?.bookings.edges[0]?.node || undefined;
}

async function mutateTicketCheckInState(
  checkIn: boolean,
  bookingReference: string,
  ticketIds: IdInput[],
  doneCallback: () => void
) {
  loadingBooking.value = true;
  emit('startingCheckIn');

  if (!performance)
    return errorHandler(
      'No performance was available when running mutateTicketCheckInState'
    );

  const response = await mutateTicketCheckInStateOperation(
    props.performanceId,
    bookingReference,
    checkIn,
    ticketIds
  );

  // Replace local booking
  if (response.booking) inspectedObjects.booking = response.booking;

  // Replace local ticket
  if (response.ticket) selectTicket(response.ticket);

  if (response.error) emit('checkInError', response.error);
  else if (checkIn) emit('checkedIn', response.message);
  else emit('unCheckedIn', response.message);

  loadingBooking.value = false;
  doneCallback();
}

// Check in tickets
async function checkInTickets(
  bookingReference: string,
  ticketIds: IdInput[],
  doneCallback: () => void
) {
  mutateTicketCheckInState(true, bookingReference, ticketIds, doneCallback);
}

// Un Check in tickets
async function unCheckInTickets(
  bookingReference: string,
  ticketIds: IdInput[],
  doneCallback: () => void
) {
  mutateTicketCheckInState(false, bookingReference, ticketIds, doneCallback);
}
</script>
