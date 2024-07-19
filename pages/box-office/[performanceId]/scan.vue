<template>
  <div :style="{ height: `${screenHeight}px` }">
    <UiInputTicketScanner
      :on="enable"
      :pause-on-decode="false"
      @ready="ready = true"
      @unable="error = $event"
      @scanned="handleScannedTicket"
      @invalid-code="handleInvalidCode"
    >
      <div class="flex flex-col h-full">
        <div class="flex items-center justify-between bg-black/60 px-6">
          <NuxtLink :href="`/box-office/${performance?.id}`"
            ><font-awesome-icon
              icon="chevron-circle-left"
              class="text-white text-3xl"
          /></NuxtLink>
          <BoxOfficeAutoCheckInControl
            v-model="autoCheckIn"
            positive-text-class="text-green-400"
            negative-text-class="text-red-400"
          />
        </div>

        <div
          v-if="!ready"
          class="flex flex-col items-center justify-center h-full space-y-3"
        >
          <template v-if="!error">
            <UiLoadingIcon size-class="fa-3x" />
            <strong>Loading Scanner...</strong>
          </template>
          <p v-else class="px-1 text-center text-sta-rouge-dark font-semibold">
            Unable to start scanner: {{ error }}
          </p>
        </div>
        <template v-else>
          <div v-if="viewDetails" class="bg-black/80 flex flex-col flex-grow">
            <div
              class="mt-auto bg-sta-gray-dark rounded-xl rounded-bl-none rounded-br-none px-5 py-3 relative"
            >
              <font-awesome-icon
                icon="times-circle"
                class="text-white text-2xl absolute -top-3 right-3 cursor-pointer"
                @click="closeDetailsView"
              />
              <div class="flex">
                <BoxOfficeBookingInspector
                  v-if="performance?.id"
                  :allow-booking-close="false"
                  :allow-mutations="currentBookingForPerformance"
                  :allow-ticket-inspections="false"
                  :loading-bookings="false"
                  :performance-id="performance.id"
                  :selected-booking="booking"
                  :selected-ticket="ticket"
                />
              </div>
              <div class="md:hidden">
                <hr
                  class="my-4 border-sta-gray border-2 rounded-lg lg:hidden"
                />
                <div
                  class="flex flex-col items-center lg:flex-row lg:gap-6 lg:justify-around"
                >
                  <BoxOfficeBookingHeader
                    v-if="booking"
                    :booking="booking"
                    class="w-full lg:w-1/2"
                  />

                  <div
                    v-if="booking"
                    class="bg-sta-gray p-2 rounded text-white"
                  >
                    <PerformanceSummaryPill
                      :performance="booking.performance"
                    />
                  </div>
                </div>
                <BoxOfficeBookingCheckInButton
                  v-if="
                    currentBookingForPerformance &&
                    bookingTicketsNotCheckedIn?.length
                  "
                  :check-in="true"
                  :number="bookingTicketsNotCheckedIn.length"
                  @check-in="
                    mutateTickets(
                      true,
                      bookingTicketsNotCheckedIn as AtLeastOneOf<IDetailedBookingTicket>,
                      $event
                    )
                  "
                />
              </div>
            </div>
          </div>
          <div v-else class="mt-auto bg-black/60 px-6 py-3">
            <BoxOfficeScanStatus
              :state="checkInState"
              :show-information-button="!!ticket"
              :show-indicator-always="autoCheckIn"
              @click-information="viewDetails = true"
            />
          </div>
        </template>
      </div>
    </UiInputTicketScanner>
  </div>
</template>

<script lang="ts" setup>
import {
  handleTicketScan,
  mutateTicketCheckInState
} from '~~/services/ticketScanService';
import type {
  ICheckInState,
  IDetailedBooking,
  IDetailedBookingTicket
} from '~~/types/box-office';
import type { AtLeastOneIdInput, AtLeastOneOf } from '~~/types/generic';

const performance = inject(injectionKeys.boxOffice.performance);

const ready = ref(false); // Whether the camera scanner is initalised
const enable = ref(true); // Whether the camera scanner is enabled
const error = ref<string>(); // Error message from ticket scanning
const autoCheckIn = ref(true); // Whether to automatically attempt to check in tickets when scanning
const viewDetails = ref(false); // Whether to show the ticket details

const ticket = ref<IDetailedBookingTicket | undefined>(); // Inspected ticket
const booking = ref<IDetailedBooking | undefined>(); // Inspected ticket

const checkInState = reactive<ICheckInState>({
  success: null,
  message: null
});

const screenHeight = useRealScreenHeight();

function setCheckInState(
  success?: boolean,
  message?: string,
  resetData = true
) {
  if (resetData) reset();
  checkInState.success = success ?? null;
  checkInState.message = message ?? null;
}

function reset() {
  ticket.value = undefined;
  error.value = undefined;
}

function handleInvalidCode() {
  setCheckInState(false, 'Invalid QR Code Scanned');
}

async function handleScannedTicket(eventData: {
  ticketData: {
    bookingReference: string;
    ticketId: string;
  };
}) {
  if (!performance) return;

  const ticketData = eventData.ticketData;

  // If we currently have a ticket selected, make sure it is not this one (prevents double scanning)
  if (ticket.value?.id === ticketData.ticketId) return;

  // Set a loading state
  setCheckInState(undefined, 'Loading...');

  // Mutate / fetch as required
  let state = await handleTicketScan(
    autoCheckIn,
    performance.id,
    ticketData.bookingReference,
    ticketData.ticketId
  );

  // Set the state to update UI
  setCheckInState(
    autoCheckIn.value
      ? !state.error
      : state.error !== undefined
        ? false
        : undefined,
    state.error ?? state.message
  );
  ticket.value = state.ticket;
  booking.value = state.booking;
}

async function mutateTickets(
  checkIn: boolean,
  tickets: AtLeastOneOf<{ id: string }>,
  callback: () => void
) {
  if (!booking.value || !performance) return;

  // Set loading state
  setCheckInState(undefined, 'Loading...', false);

  const ticketIds = tickets.map((ticket) => ticket.id) as AtLeastOneIdInput;

  const response = await mutateTicketCheckInState(
    performance.id,
    booking.value?.reference,
    checkIn,
    ticketIds
  );

  setCheckInState(!response.error, response.error ?? response.message, false);
  ticket.value = response.ticket;
  booking.value = response.booking;
  callback();
}

function closeDetailsView() {
  setCheckInState(undefined, undefined, true);
  viewDetails.value = false;
  enable.value = false;
  nextTick(() => (enable.value = true));
}

const bookingTicketsNotCheckedIn = computed(() =>
  booking.value?.tickets?.filter(
    (subjectTicket) =>
      !subjectTicket.checkedInAt && subjectTicket.id !== ticket.value?.id
  )
);

const currentBookingForPerformance = computed(
  () => booking.value?.performance.id === performance?.id
);
</script>
