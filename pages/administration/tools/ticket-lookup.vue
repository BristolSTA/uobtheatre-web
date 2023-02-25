<template>
  <AdminPage title="Ticket Lookup">
    <div v-if="!scannedData">
      <div v-if="!useCameraScanner" class="text-center">
        <h3 class="text-h3">Scan a ticket with a barcode scanner</h3>
        <p>or</p>
        <UiStaButton colour="orange" @click="useCameraScanner = true"
          >Scan With Camera</UiStaButton
        >
      </div>
      <UiInputTicketScanner
        v-else
        @scanned="onScan($event.ticketData)"
        @invalid-code="onInvalidCode"
      />
    </div>
    <div v-else class="space-y-2">
      <h2 class="text-h2">Scanned Details</h2>
      Booking Reference: {{ scannedData.bookingReference }} | Ticket ID:
      {{ scannedData.ticketId }}
      <p>
        <UiStaButton colour="orange" @click="scannedData = undefined"
          >Scan Again</UiStaButton
        >
        <UiStaButton
          v-if="bookingInfo"
          class="ml-4"
          colour="green"
          :to="`/administration/productions/${bookingInfo.performance.production.slug}/bookings/${bookingInfo.reference}`"
          >View Booking</UiStaButton
        >
      </p>
      <div class="flex flex-wrap gap-4 lg:flex-nowrap lg:space-y-0">
        <div class="flex-grow">
          <UiCard v-if="ticket" title="Ticket">
            <BoxOfficeBookingTicketDetails :ticket="ticket" />
          </UiCard>
        </div>
        <div class="flex-grow">
          <UiCard v-if="bookingInfo" title="Booking">
            <BoxOfficeBookingDetails
              :booking="bookingInfo"
              :allow-ticket-inspections="false"
            />
          </UiCard>
        </div>
      </div>
    </div>
  </AdminPage>
</template>

<script lang="ts" setup>
import { errorToast } from '~~/utils/alerts';
import { TicketQRCodeData } from '~~/types/ticket';
import { handleTicketScan } from '~~/components/box-office/BoxOfficeSharedFunctions';
import {
  IDetailedBooking,
  IDetailedBookingTicket
} from '~~/components/box-office/BoxOfficeSharedTypes';

const ticket = ref<IDetailedBookingTicket | undefined>();
const bookingInfo = ref<IDetailedBooking | undefined>();
const scannedData = ref<TicketQRCodeData | undefined>();
const useCameraScanner = ref(false);

const hardwareScannedDetails = useHardwareTicketScanner();

watch(hardwareScannedDetails.ticketDetails, (newVal) => {
  if (!newVal) return;

  onScan(newVal);
});

watch(hardwareScannedDetails.isInvalid, (newVal) => {
  if (!newVal) return;

  onInvalidCode();
});

function onInvalidCode() {
  errorToast.fire({
    title: 'Invalid ticket QR code scanned'
  });
}

async function onScan(ticketData: TicketQRCodeData) {
  scannedData.value = ticketData;
  bookingInfo.value = undefined;

  const response = await handleTicketScan(
    false,
    undefined,
    scannedData.value.bookingReference,
    [scannedData.value.ticketId]
  );
  bookingInfo.value = response.booking;
  ticket.value = response.ticket;

  if (!bookingInfo.value) {
    return errorToast.fire({
      title: 'A matching booking does not exisit for this reference'
    });
  }
}
</script>
