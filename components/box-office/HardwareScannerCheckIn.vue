<template>
  <div>
    <h2 class="font-bold">Scan a Ticket</h2>
    <text-input
      ref="input"
      v-model="scannedCode"
      :placeholder="placeholder"
      input-class="py-3 text-center focus:ring ring-sta-green"
      @change="checkTicket"
      @blur="placeholder = 'Click here then scan'"
      @focus="placeholder = 'Scan a Ticket...'"
    />
    <check-in-notification
      v-if="checkedInData.success !== undefined"
      class="mt-4"
      :errors="checkedInData.errors"
      :booking="checkedInData.booking"
      :ticket="checkedInData.ticket"
      :scan-data="checkedInData.scanData"
      @close="closeNotificaton"
    />
    <invalid-code-notification
      v-if="invalidCode"
      class="mt-4"
      @close="invalidCode = false"
    />
  </div>
</template>

<script>
import CheckInScan from '@/graphql/queries/box-office/CheckInScan.gql'
import Ticket from '@/classes/Ticket'
import TextInput from '../ui/TextInput.vue'
import CheckInNotification from './CheckInNotification.vue'
import InvalidCodeNotification from './InvalidCodeNotification.vue'

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
  components: { TextInput, CheckInNotification, InvalidCodeNotification },
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
      invalidCode: false,
      placeholder: 'Scan a Ticket...',
    }
  },
  watch: {
    scannedCode() {
      this.invalidCode = false
    },
  },
  mounted() {
    this.$refs.input.focus()
  },
  methods: {
    async checkTicket() {
      if (!this.scannedCode) return
      this.checkedInData = checkedInDataState()
      try {
        const { bookingReference, ticketId } = Ticket.dataFromQRCode(
          this.scannedCode
        )
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
      } catch (e) {
        const isAllowedSilentException =
          e instanceof SyntaxError ||
          (e instanceof DOMException &&
            e.message.includes(
              'The string to be decoded is not correctly encoded'
            ))
        this.invalidCode = true
        if (!isAllowedSilentException) throw e
      }
    },
  },
}
</script>
