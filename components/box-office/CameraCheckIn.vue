<template>
  <div>
    <div class="fixed top-0 bottom-0 left-0 right-0 md:static">
      <qrcode-stream
        class="md:max-w-md"
        :camera="cameraOff ? 'off' : 'auto'"
        @init="onInit"
        @decode="onDecode"
      >
        <div class="mt-4 text-center">
          <strong v-if="!cameraOff">Scan a ticket QR code</strong>
        </div>
      </qrcode-stream>
      <check-in-notification
        v-if="checkedInData.booking"
        :booking="checkedInData.booking"
        :ticket="checkedInData.ticket"
      />
    </div>
  </div>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'
import Ticket from '@/classes/Ticket'
import CheckInScan from '@/graphql/queries/box-office/CheckInScan.gql'
import CheckInNotification from './CheckInNotification.vue'
export default {
  components: {
    QrcodeStream,
    CheckInNotification,
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
      checkedInData: {
        booking: null,
        ticket: null,
      },
    }
  },
  methods: {
    async onInit(promise) {
      try {
        await promise
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          // user denied camera access permisson
          alert('User denied camera access')
        } else if (error.name === 'NotFoundError') {
          // no suitable camera device installed
          alert('No cameras available')
        } else if (error.name === 'NotSupportedError') {
          // page is not served over HTTPS (or localhost)
          alert('Denied access due https')
        } else if (error.name === 'NotReadableError') {
          // maybe camera is already in use
          alert('Camera already in use')
        } else if (error.name === 'OverconstrainedError') {
          // did you requested the front camera although there is none?
          alert('Overcontrained device query')
        } else if (error.name === 'StreamApiNotSupportedError') {
          // browser seems to be lacking features
          alert('Device not able')
        }
      } finally {
        // hide loading indicator
        console.log('init ok!')
      }
    },
    async onDecode(string) {
      this.cameraOff = true
      const { bookingReference, ticketId } = Ticket.dataFromQRCode(string)
      console.log(string, bookingReference, ticketId)
      try {
        const { data } = await this.$apollo.mutate({
          mutation: CheckInScan,
          variables: {
            reference: bookingReference,
            performanceId: this.performanceId,
            tickets: [{ ticketId }],
          },
        })
        console.log(data)
        this.checkedInData.booking = data.checkInBooking.booking
        this.checkedInData.ticket = data.checkInBooking.booking.tickets.find(
          (ticket) => ticket.id === ticketId
        )
      } catch (e) {
        console.log(e)
      } finally {
        this.cameraOff = false
      }
    },
  },
}
</script>
