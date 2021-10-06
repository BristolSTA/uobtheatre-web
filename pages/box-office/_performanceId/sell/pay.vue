<template>
  <div v-if="booking.tickets.length">
    <div class="grid gap-2 md:grid-cols-2">
      <tickets-overview :booking="booking" />
      <booking-price-overview :booking="booking" />
    </div>
    <div class="grid gap-2 my-4 md:grid-cols-2">
      <div class="p-3 rounded bg-sta-gray-dark">
        <h2 class="text-center text-h2">Details</h2>
        <text-input v-model="user.email" name="Email" type="email" required />
      </div>
      <div class="p-3 rounded bg-sta-gray-dark">
        <h2 class="text-center text-h2">Payment</h2>
        <div v-if="!canPay" class="text-center">
          <h3 class="text-h3 text-sta-rouge">Complete User Details First</h3>
          <p>
            We collect the booker's details to send them their receipt and to
            help process refunds. We never send unsolicited emails.
          </p>
        </div>
        <template v-else>
          <h3 class="text-center text-h3 text-sta-orange">
            £{{ booking.totalPricePounds }} due
          </h3>
          <loading-container :loading="paying">
            <all-errors-display class="text-center" :errors="errors" />
            <div class="grid grid-cols-2 gap-2 text-center">
              <template v-if="booking.totalPrice > 0">
                <button
                  v-if="enabledMethods.squarePOS && availableTerminals.length"
                  class="
                    p-2
                    transition-colors
                    rounded
                    bg-sta-green
                    hover:bg-sta-green-dark
                    focus:outline-none
                  "
                  @click="terminalDevice ? pay('SQUARE_POS') : selectTerminal()"
                >
                  <font-awesome-icon icon="money-bill" />
                  Pay with Card
                  {{ terminalDevice ? `(${terminalDevice.name})` : '' }}
                </button>
                <button
                  v-else-if="enabledMethods.manualCard"
                  class="
                    p-2
                    transition-colors
                    rounded
                    bg-sta-green
                    hover:bg-sta-green-dark
                    focus:outline-none
                    btn
                    disabled
                  "
                  @click="paymentMode = 'CARD'"
                >
                  <font-awesome-icon icon="money-check-alt" />
                  Pay using Card
                </button>
                <button
                  v-if="enabledMethods.cash"
                  class="
                    p-2
                    transition-colors
                    rounded
                    bg-sta-green
                    hover:bg-sta-green-dark
                    focus:outline-none
                  "
                  @click="paymentMode = 'CASH'"
                >
                  <font-awesome-icon icon="money-bill" />
                  Pay with Cash
                </button>
              </template>
              <button
                v-else
                class="
                  p-2
                  transition-colors
                  rounded
                  bg-sta-green
                  hover:bg-sta-green-dark
                  focus:outline-none
                "
                @click="pay(null)"
              >
                <font-awesome-icon icon="money-bill" />
                Complete Booking
              </button>
            </div>
            <div v-if="paymentMode == 'CASH'" class="my-2">
              <div class="py-2 text-xl text-center">Change Calculator</div>
              <div class="grid grid-cols-2 gap-2">
                <div class="flex items-center w-full">
                  <span class="mx-2 text-xl font-semibold">£</span>
                  <input
                    v-model.number="tendered"
                    type="text"
                    class="w-full p-1 text-gray-800 rounded outline-none"
                    placeholder="Tendered"
                  />
                </div>
                <div
                  v-if="cashChange"
                  class="flex items-center justify-center px-4 text-lg"
                >
                  Change:
                  <strong class="pl-2 text-xl">£{{ cashChange }}</strong>
                </div>
              </div>
            </div>
            <div v-if="paymentMode" class="mt-4 text-center">
              <button
                class="
                  p-2
                  rounded
                  animate-pulse
                  bg-sta-orange
                  hover:bg-sta-orange-dark
                "
                @click="pay(paymentMode)"
              >
                <strong
                  >Click Here When Payment Processed ({{ paymentMode }})</strong
                >
              </button>
            </div>
            <template v-if="paymentMode == 'SQUARE_POS'" #overlay>
              <div>
                <button
                  class="
                    p-2
                    mt-4
                    transition-colors
                    rounded
                    bg-sta-rouge
                    hover:bg-sta-rouge-dark
                  "
                  @click="cancelSquarePOSPayment"
                >
                  Cancel
                </button>
              </div>
            </template>
          </loading-container>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import TextInput from '@/components/ui/TextInput.vue'
import Booking from '@/classes/Booking'
import BookingPriceOverview from '@/components/booking/overview/BookingPriceOverview.vue'
import TicketsOverview from '@/components/booking/overview/TicketsOverview.vue'
import PayBooking from '@/graphql/mutations/booking/PayBooking.gql'
import SetBookingUser from '@/graphql/mutations/booking/SetBookingUser.gql'
import {
  getValidationErrors,
  performMutation,
  silentErrorHandler,
  swal,
} from '@/utils'
import AllErrorsDisplay from '@/components/ui/AllErrorsDisplay.vue'
import LoadingContainer from '@/components/ui/LoadingContainer.vue'

const enabledMethods = {
  cash: true,
  manualCard: false,
  squarePOS: true,
}

export default {
  components: {
    TextInput,
    BookingPriceOverview,
    TicketsOverview,
    AllErrorsDisplay,
    LoadingContainer,
  },
  props: {
    booking: {
      required: true,
      type: Booking,
    },
  },
  data() {
    return {
      user: {
        email: null,
      },

      paymentMode: null,
      paying: false,
      tendered: null,
      refreshedBooking: null,

      errors: null,

      availableTerminals: [
        // TODO: not have this here...
        { id: 1, deviceId: '123', name: 'Terminal 1' },
        { id: 2, deviceId: '345', name: 'Terminal 2' },
      ],
      enabledMethods,
    }
  },
  computed: {
    canPay() {
      return /\S+@\S+\.\S+/.test(this.user.email)
    },
    cashChange() {
      if (!this.tendered || this.tendered < this.booking.totalPricePounds)
        return ''
      return (this.tendered - this.booking.totalPricePounds).toFixed(2)
    },
    terminalDevice() {
      return this.$store.state['box-office'].terminalDevice
    },
  },
  async mounted() {
    if (!this.booking.tickets.length) return this.$router.replace('./')
    try {
      this.availableTerminals = await this.$store.dispatch(
        'box-office/retrieveAvailableTerminalDevices'
      )
      // If we already have a device, let's check it's still good
      if (
        this.terminalDevice &&
        !this.availableTerminals.find(
          (device) => device.id === this.terminalDevice.id
        )
      ) {
        this.$store.commit('box-office/SET_TERMINAL_DEVICE', null)
      }
    } catch (e) {
      silentErrorHandler(e)
    }
  },
  apollo: {
    refreshedBooking: {
      query: require('@/graphql/queries/box-office/BoxOfficePerformanceBooking.gql'),
      variables() {
        return {
          bookingId: this.booking.id,
          performanceId: this.booking.performance.id,
        }
      },
      skip() {
        return !this.paying || this.paymentMode !== 'SQUARE_POS'
      },
      update: (data) =>
        data.performance.bookings.edges.length
          ? data.performance.bookings.edges[0].node
          : null,
      result() {
        if (this.refreshedBooking.status.value === 'PAID') {
          this.bookingCompleted(this.refreshedBooking)
        }
      },
      pollInterval: 1000,
    },
  },
  methods: {
    cancelSquarePOSPayment() {
      this.paying = false
      this.paymentMode = null
    },
    async selectTerminal() {
      const terminalOptions = Object.fromEntries(
        this.availableTerminals.map((device, index) => [index, device.name])
      )
      const { value } = await swal.fire({
        title: 'Select a payment device',
        input: 'select',
        inputOptions: terminalOptions,
        showCancelButton: true,
      })
      const device = value !== null ? this.availableTerminals[value] : null
      if (device) {
        this.$store.commit('box-office/SET_TERMINAL_DEVICE', device)
      }
    },
    async pay(method) {
      if (this.paying) return
      this.paying = true
      this.paymentMode = method

      try {
        // Set the booking's user
        await performMutation(
          this.$apollo,
          {
            mutation: SetBookingUser,
            variables: {
              id: this.booking.id,
              email: this.user.email,
            },
          },
          'updateBooking'
        )

        const data = await performMutation(
          this.$apollo,
          {
            mutation: PayBooking,
            variables: {
              id: this.booking.id,
              totalPence: this.booking.totalPrice,
              provider: method,
              idempotencyKey: this.booking.idempotencyKey,
              deviceId: this.terminalDevice?.deviceId,
            },
          },
          'payBooking'
        )

        if (method === 'SQUARE_POS') {
          return
        }

        return this.bookingCompleted(data.payBooking.booking)
      } catch (e) {
        this.errors = getValidationErrors(e)
        this.booking.refreshIdempotencyKey()
        this.paying = false
      }
    },
    bookingCompleted(bookingData) {
      this.paying = false
      this.booking.updateFromAPIData(bookingData)
      this.$router.push(
        `/box-office/${this.booking.performance.id}/sell/complete`
      )
    },
  },
}
</script>
