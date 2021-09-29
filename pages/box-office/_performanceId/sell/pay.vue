<template>
  <div>
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
            help process refunds.
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
                  :disabled="true"
                  @click="selectedManualMode = 'CARD'"
                >
                  <font-awesome-icon icon="money-check-alt" />
                  Paid using Card
                </button>
                <button
                  class="
                    p-2
                    transition-colors
                    rounded
                    bg-sta-green
                    hover:bg-sta-green-dark
                    focus:outline-none
                  "
                  @click="selectedManualMode = 'CASH'"
                >
                  <font-awesome-icon icon="money-bill" />
                  Paid with Cash
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
            <div v-if="selectedManualMode == 'CASH'" class="my-2">
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
            <div v-if="selectedManualMode" class="mt-4 text-center">
              <button
                class="
                  p-2
                  rounded
                  animate-pulse
                  bg-sta-orange
                  hover:bg-sta-orange-dark
                "
                @click="pay(selectedManualMode)"
              >
                <strong
                  >Click Here When Payment Processed ({{
                    selectedManualMode
                  }})</strong
                >
              </button>
            </div>
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
import { getValidationErrors, performMutation } from '@/utils'
import AllErrorsDisplay from '@/components/ui/AllErrorsDisplay.vue'
import LoadingContainer from '@/components/ui/LoadingContainer.vue'
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
      selectedManualMode: null,
      paying: false,
      errors: null,
      tendered: null,
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
  },
  methods: {
    async pay(method) {
      if (this.paying) return
      this.paying = true

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
            },
          },
          'payBooking'
        )

        this.booking.updateFromAPIData(data.payBooking.booking)
        this.$router.push(
          `/box-office/${this.booking.performance.id}/sell/complete`
        )
      } catch (e) {
        this.errors = getValidationErrors(e)
        this.booking.refreshIdempotencyKey()
      } finally {
        this.paying = false
      }
    },
  },
}
</script>
