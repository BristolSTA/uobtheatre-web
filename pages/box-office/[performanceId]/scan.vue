<template>
  <div class="h-screen">
    <BoxOfficeCameraScanner
      :on="enable"
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
              <BoxOfficeBookingTicketDetails
                v-if="ticket"
                :ticket="ticket"
                :allow-check-in="currentBookingForPerformance"
                @check-in="
                  mutateTickets(
                    true,
                    [$event.ticket],
                    $event.asyncCompleteCallback
                  )
                "
                @un-check-in="
                  mutateTickets(
                    false,
                    [$event.ticket],
                    $event.asyncCompleteCallback
                  )
                "
              />
              <hr class="my-4 border-black border-2" />
              <BoxOfficeBookingHeader v-if="booking" :booking="booking" />
              <PerformanceSummaryPill
                v-if="!currentBookingForPerformance"
                :performance="booking?.performance"
              />
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
          <div v-else-if="autoCheckIn" class="mt-auto bg-black/60 px-6 py-3">
            <BoxOfficeDesktopCheckin
              :state="checkInState"
              :show-information-button="!!ticket"
              @click-information="viewDetails = true"
            />
          </div>
        </template>
      </div>
    </BoxOfficeCameraScanner>
  </div>
</template>

<script lang="ts" setup>
import { mutateTicketCheckInState } from '~~/components/box-office/BoxOfficeSharedFunctions';
import type {
  ICheckInState,
  IDetailedBooking,
  IDetailedBookingTicket
} from '~~/components/box-office/BoxOfficeSharedTypes';
import { useAdminBookingLookupQuery } from '~~/graphql/codegen/operations';
import { AtLeastOneIdInput, AtLeastOneOf } from '~~/types/generic';

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

async function handleScannedTicket(ticketData: {
  bookingReference: string;
  ticketId: string;
}) {
  if (!performance) return;

  // If we currently have a ticket selected, make sure it is not this one (prevents double scanning)
  if (ticket.value?.id === ticketData.ticketId) return;

  // Set a loading state
  setCheckInState(undefined, 'Loading...');

  //TODO: Handle non-auto check in mode

  // Attempt to check in the ticket
  const response = await mutateTicketCheckInState(
    performance.id,
    ticketData.bookingReference,
    true,
    [ticketData.ticketId]
  );

  // If we got an error from the check in operation, load the booking and ticket information to allow the user to interrogate
  if (response.error) {
    const { onResult } = useAdminBookingLookupQuery({
      reference: ticketData.bookingReference
    });

    onResult((result) => {
      if (result.data?.bookings?.edges.length) {
        booking.value = result.data?.bookings?.edges[0]?.node || undefined;
        ticket.value = booking.value?.tickets?.find(
          (ticket) => ticket.id === ticketData.ticketId
        );
      }
    });
  }

  // Set the state to update UI
  setCheckInState(!response.error, response.error ?? response.message);
  ticket.value = response.ticket;
  booking.value = response.booking;
}

async function mutateTickets(
  checkIn: boolean,
  tickets: AtLeastOneOf<{ id: string }>,
  callback: () => void
) {
  if (!booking.value) return;

  setCheckInState(undefined, 'Loading...', false);

  const ticketIds = tickets.map((ticket) => ticket.id) as AtLeastOneIdInput;

  const response = await mutateTicketCheckInState(
    booking.value.performance.id,
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
  setCheckInState();
  viewDetails.value = false;
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
