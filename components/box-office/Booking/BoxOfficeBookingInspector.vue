<template>
  <div
    class="w-full md:w-1/3"
    :class="{ 'hidden md:block': !inspectedObjects.ticket }"
  >
    <BoxOfficeBookingTicketDetails
      v-if="inspectedObjects.ticket"
      :ticket="inspectedObjects.ticket"
      :allow-check-in="true"
      class="h-full overflow-y-auto bg-sta-gray-dark rounded-xl px-5 py-3"
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
  <div
    class="flex-grow bg-sta-gray-dark rounded-xl p-2 md:p-5 py-3 flex-col relative"
    :class="[inspectedObjects.ticket ? 'hidden md:flex' : 'flex']"
  >
    <div class="absolute right-0 top-0 z-10">
      <font-awesome-icon
        v-if="inspectedObjects.booking"
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
          @select="selectBooking($event)"
        />
        <template v-else>
          <BoxOfficeBookingHeader
            :booking="inspectedObjects.booking"
            class="flex-none"
          />
          <div class="flex-grow overflow-y-auto my-2">
            <BoxOfficeBookingTickets
              v-if="inspectedObjects.booking.tickets"
              :tickets="inspectedObjects.booking.tickets"
              class="w-full text-white"
              @select-ticket="selectTicket($event)"
            />
            <h3 v-else class="font-bold text-center">No tickets in booking</h3>
          </div>
          <BoxOfficeBookingCheckInButton
            v-if="ticketsNotCheckedIn?.length"
            :check-in="true"
            :number="ticketsNotCheckedIn.length"
            @check-in="
              ticketsNotCheckedIn
                ? checkInTickets(
                    inspectedObjects.booking!.reference,
                    ticketsNotCheckedIn.map((ticket) => ticket.id),
                    $event
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
  IBookingTicketProp,
  IDetailedBooking,
  IDetailedBookingTicket,
  ISimpleBooking
} from '~~/components/box-office/BoxOfficeSharedTypes';
import { mutateTicketCheckInState as mutateTicketCheckInStateOperation } from '~~/components/box-office/BoxOfficeSharedFunctions';
import {
  BoxOfficePerformanceBookingDocument,
  BoxOfficePerformanceBookingQuery,
  BoxOfficePerformanceBookingQueryVariables
} from '~~/graphql/codegen/operations';
import { IdInput } from '~~/types/generic';

// Props

const props = defineProps<{
  performanceId: string;
  loadingBookings: boolean;
  bookings: ISimpleBooking[];

  selectedTicket?: { id: string };
  selectedBooking?: IDetailedBooking;
}>();

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

// Computed
const ticketsNotCheckedIn = computed(() =>
  inspectedObjects.booking?.tickets?.filter(
    (ticket: IBookingTicketProp) => !ticket.checkedInAt
  )
);

// Methods

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
