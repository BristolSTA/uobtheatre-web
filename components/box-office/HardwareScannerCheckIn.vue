<template>
  <div>
    <hardware-scanner
      ref="scanInput"
      v-model="scannedCode"
      @scanned="checkTicket"
      @invalidCode="$emit('invalidCode')"
    />
    <check-in-notification
      v-if="checkedInData.success !== undefined"
      class="mt-4"
      :errors="checkedInData.errors"
      :booking="checkedInData.booking"
      :ticket="checkedInData.ticket"
      :scan-data="checkedInData.scanData"
      @close="closeNotificaton"
      @checkInAll="checkInAll"
    />
  </div>
</template>

<script>
import CheckInNotification from './CheckInNotification.vue';
import HardwareScanner from './HardwareScanner.vue';
import CheckInScan from '@/graphql/mutations/box-office/CheckInTickets.gql';
import { successToast } from '@/utils/alerts';

const checkedInDataState = () => {
  return {
    success: undefined,
    errors: null,
    booking: null,
    ticket: null,
    scanData: {}
  };
};
export default {
  components: {
    CheckInNotification,
    HardwareScanner
  },
  props: {
    performanceId: {
      required: true,
      type: [Number, String]
    }
  },
  data() {
    return {
      scannedCode: null,
      checkedInData: checkedInDataState()
    };
  },
  methods: {
    async checkTicket(scannedData) {
      this.$emit('scanned', scannedData);
      const { bookingReference, ticketId } = scannedData;
      this.checkedInData = checkedInDataState();
      this.scannedCode = null;

      const { data } = await this.$apollo.mutate({
        mutation: CheckInScan,
        variables: {
          reference: bookingReference,
          performanceId: this.performanceId,
          tickets: [{ ticketId }]
        }
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
    },
    async checkInAll() {
      const ticketIdsToCheckin = this.checkedInData.booking.tickets
        .filter((ticket) => !ticket.checkedIn)
        .map((ticket) => {
          return {
            ticketId: ticket.id
          };
        });
      if (ticketIdsToCheckin.length) {
        const { data } = await this.$apollo.mutate({
          mutation: CheckInScan,
          variables: {
            reference: this.checkedInData.booking.reference,
            performanceId: this.performanceId,
            tickets: ticketIdsToCheckin
          }
        });

        this.checkedInData.booking = data.checkInBooking.booking;
      }

      successToast.fire({
        title: 'All Booking Tickets Checked In'
      });

      this.$refs.scanInput.focus();
    },
    closeNotificaton() {
      this.checkedInData = checkedInDataState();
    }
  }
};
</script>
