<template>
  <div class="h-screen">
    <BoxOfficeCameraScanner
      :on="enable"
      @ready="ready = true"
      @unable="error = $event"
      @scanned="handleScannedTicket"
      @invalid-code="handleInvalidCode"
    >
      <div v-if="ready" class="flex flex-col h-full">
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

        <div v-if="autoCheckIn" class="mt-auto bg-black/60 px-6 py-3">
          <BoxOfficeDesktopCheckin
            :state="checkInState"
            :show-information-button="!!ticket"
          />
        </div>
      </div>

      <div
        v-else
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
    </BoxOfficeCameraScanner>
  </div>
</template>

<script lang="ts" setup>
import { mutateTicketCheckInState } from '~~/components/box-office/BoxOfficeSharedFunctions';
import type {
  ICheckInIndicator,
  IDetailedBookingTicket
} from '~~/components/box-office/BoxOfficeSharedTypes';

const performance = inject(injectionKeys.boxOffice.performance);

const ready = ref(false); // Whether the camera scanner is initalised
const enable = ref(true); // Whether the camera scanner is enabled
const error = ref<string>(); // Error message from ticket scanning
const autoCheckIn = ref(true); // Whether to automatically attempt to check in tickets when scanning

const ticket = ref<IDetailedBookingTicket>(); // Inspected ticket

const checkInState = reactive<ICheckInIndicator>({
  success: null,
  message: null
});

function setCheckInState(success?: boolean, message?: string) {
  reset();
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

  setCheckInState(undefined, 'Loading...');

  const response = await mutateTicketCheckInState(
    performance.id,
    ticketData.bookingReference,
    true,
    [ticketData.ticketId]
  );

  setCheckInState(!response.error, response.error ?? response.message);
  ticket.value = response.ticket;
}
</script>
