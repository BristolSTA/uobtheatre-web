<template>
  <div class="fixed bottom-0 left-0 right-0 top-0 md:static">
    <camera-scanner
      :on="!cameraOff"
      class="bg-gray-800"
      @invalidCode="onInvalidCode"
      @scanned="onScan"
      @close="$emit('close')"
    />
    <div class="absolute bottom-0 left-0 right-0 mt-4 pt-1 md:relative">
      <check-in-notification
        v-if="checkedInData.success !== undefined"
        :errors="checkedInData.errors"
        :booking="checkedInData.booking"
        :ticket="checkedInData.ticket"
        :scan-data="checkedInData.scanData"
        @close="closeNotificaton"
        @checkInAll="checkInAll"
      />
    </div>
    <div class="absolute mt-4 md:static">
      <invalid-code-notification
        v-if="invalidCode"
        @close="invalidCode = false"
      />
    </div>
  </div>
</template>

<script>
import CheckInNotification from "./CheckInNotification.vue";
import InvalidCodeNotification from "./InvalidCodeNotification.vue";
import CameraScanner from "./CameraScanner.vue";
import { successToast } from "@/utils";
import CheckInScan from "@/graphql/mutations/box-office/CheckInTickets.gql";

const checkedInDataState = () => {
  return {
    success: undefined,
    errors: null,
    booking: null,
    ticket: null,
    scanData: {},
  };
};

export default {
  components: {
    CheckInNotification,
    InvalidCodeNotification,
    CameraScanner,
  },

  props: {
    performanceId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      cameraOff: false,
      invalidCode: false,
      checkedInData: checkedInDataState(),
    };
  },
  methods: {
    onInvalidCode() {
      this.checkedInData = checkedInDataState();
      this.invalidCode = true;
    },
    async onScan(scannedData) {
      this.$emit("scanned", scannedData);
      const { bookingReference, ticketId } = scannedData;
      this.checkedInData = checkedInDataState();
      this.invalidCode = false;
      this.cameraOff = true;

      const { data } = await this.$apollo.mutate({
        mutation: CheckInScan,
        variables: {
          reference: bookingReference,
          performanceId: this.performanceId,
          tickets: [{ ticketId }],
        },
      });
      this.checkedInData.success = data.checkInBooking.success;
      this.checkedInData.booking = data.checkInBooking.booking;
      this.checkedInData.scanData = { bookingReference, ticketId };
      if (data.checkInBooking.booking) {
        this.checkedInData.ticket = data.checkInBooking.booking.tickets.find(
          (ticket) => ticket.id === ticketId
        );
      }
      this.checkedInData.errors = data.checkInBooking.errors;
      this.cameraOff = false;
    },
    async checkInAll() {
      const ticketIdsToCheckin = this.checkedInData.booking.tickets
        .filter((ticket) => !ticket.checkedIn)
        .map((ticket) => {
          return {
            ticketId: ticket.id,
          };
        });
      if (ticketIdsToCheckin.length) {
        const { data } = await this.$apollo.mutate({
          mutation: CheckInScan,
          variables: {
            reference: this.checkedInData.booking.reference,
            performanceId: this.performanceId,
            tickets: ticketIdsToCheckin,
          },
        });
        this.checkedInData.booking = data.checkInBooking.booking;
      }

      successToast.fire({
        title: "All Booking Tickets Checked In",
      });
    },
    closeNotificaton() {
      this.checkedInData = checkedInDataState();
    },
  },
};
</script>
