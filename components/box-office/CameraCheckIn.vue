<template>
  <div class="fixed top-0 bottom-0 left-0 right-0 md:static">
    <camera-scanner
      :on="!cameraOff"
      class="bg-gray-800"
      @invalidCode="onInvalidCode"
      @scan="onScan"
      @close="$emit('close')"
    />
    <div class="absolute bottom-0 left-0 right-0 pt-1 mt-4 md:relative">
      <check-in-notification
        v-if="checkedInData.success !== undefined"
        :errors="checkedInData.errors"
        :booking="checkedInData.booking"
        :ticket="checkedInData.ticket"
        :scan-data="checkedInData.scanData"
        @close="closeNotificaton"
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
import CheckInScan from '@/graphql/queries/box-office/CheckInTickets.gql'
import CheckInNotification from './CheckInNotification.vue'
import InvalidCodeNotification from './InvalidCodeNotification.vue'
import CameraScanner from './CameraScanner.vue'

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
    }
  },
  methods: {
    onInvalidCode() {
      this.checkedInData = checkedInDataState()
      this.invalidCode = true
    },
    async onScan({ bookingReference, ticketId }) {
      this.checkedInData = checkedInDataState()
      this.invalidCode = false
      this.cameraOff = true

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
      this.cameraOff = false
    },
    closeNotificaton() {
      this.checkedInData = checkedInDataState()
    },
  },
}
</script>
