<template>
  <div>
    <hardware-scanner v-model="scannedCode" @scanned="checkTicket" />
    <check-in-notification
      v-if="checkedInData.success !== undefined"
      class="mt-4"
      :errors="checkedInData.errors"
      :booking="checkedInData.booking"
      :ticket="checkedInData.ticket"
      :scan-data="checkedInData.scanData"
      @close="closeNotificaton"
    />
  </div>
</template>

<script>
import CheckInScan from '@/graphql/queries/box-office/CheckInTickets.gql'
import CheckInNotification from './CheckInNotification.vue'
import HardwareScanner from './HardwareScanner.vue'

const checkedInDataState = () => {
  return {
    success: undefined,
    errors: null,
    booking: null,
    ticket: null,
    scanData: {},
  }
}
export default {
  components: {
    CheckInNotification,
    HardwareScanner,
  },
  props: {
    performanceId: {
      required: true,
      type: [Number, String],
    },
  },
  data() {
    return {
      scannedCode: null,
      checkedInData: checkedInDataState(),
    }
  },
  methods: {
    async checkTicket({ bookingReference, ticketId }) {
      this.checkedInData = checkedInDataState()
      this.scannedCode = null

      const { data } = await this.$apollo.mutate({
        mutation: CheckInScan,
        variables: {
          reference: bookingReference,
          performanceId: this.performanceId,
          tickets: [{ ticketId }],
        },
      })
      this.checkedInData.success = data.checkInBooking.success
      this.checkedInData.booking = data.checkInBooking.booking
      this.checkedInData.scanData = { bookingReference, ticketId }
      if (data.checkInBooking.booking)
        this.checkedInData.ticket = data.checkInBooking.booking.tickets.find(
          (ticket) => ticket.id === ticketId
        )
      this.checkedInData.errors = data.checkInBooking.errors
    },
    closeNotificaton() {
      this.checkedInData = checkedInDataState()
    },
  },
}
</script>
