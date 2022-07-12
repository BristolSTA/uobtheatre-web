<template>
  <div>
    <div
      v-if="booking.performance && booking.performance.production"
      class="mb-2 p-2 bg-sta-gray-light md:text-center"
    >
      <p class="text-white text-h3">
        {{ booking.performance.production.name }}
      </p>
      <p class="text-sta-orange">
        {{ booking.performance.start | dateFormat('cccc d MMM y') }}, Starting
        at
        {{ booking.performance.start | dateFormat('T') }}
      </p>
      <p class="text-sta-orange">
        {{ booking.tickets.length }} Ticket{{
          booking.tickets.length > 1 ? 's' : ''
        }}
      </p>
    </div>
    <all-errors-display class="text-center" :errors="errors" />
    <template v-if="booking.totalPrice > 0">
      <div class="container">
        <square-payment
          :price="booking.totalPricePounds"
          @paying="onPaying()"
          @cancelled="progressPopup.close()"
          @nonceRecieved="onNonceRecieved"
        />
      </div>
      <p class="mt-4 text-center text-sta-gray-lighter">
        Your payment is handled securely by Square. We do not directly store or
        process your card details.
      </p>
      <p class="mt-4 text-center">
        <strong>Please note:</strong> By paying / completing a booking you
        confirm that you have read and agree to our
        <a
          href="/terms"
          target="_blank"
          class="text-sta-orange hover:text-sta-orange-dark transition-colors"
          >booking terms of conditions.</a
        >
        As per these terms, all our tickets are, in most cases, non-refundable
        and non-transferable.
      </p>
    </template>
    <loading-container v-else :loading="loading">
      <div class="text-center space-y-6">
        <p>
          This total for this booking is £{{ booking.totalPrice }}, so no
          payment is requried. Please click below to complete your booking.
        </p>
        <button
          class="
            p-2
            bg-sta-green
            hover:bg-sta-green-dark
            rounded
            focus:outline-none
            transition-colors
          "
          @click="payFree"
        >
          Complete Booking
        </button>
      </div>
    </loading-container>
  </div>
</template>

<script>
import Swal from 'sweetalert2'

import Booking from '@/classes/Booking'
import AllErrorsDisplay from '@/components/ui/AllErrorsDisplay.vue'
import { getValidationErrors, performMutation, swal } from '@/utils'
import BookingStage from '@/classes/BookingStage'
import SquarePayment from '@/components/square/SquarePayment.vue'
import LoadingContainer from '@/components/ui/LoadingContainer.vue'
export default {
  stageInfo: new BookingStage({
    name: 'Payment',
    routeName: 'production-slug-book-performanceId-pay',
    eligable: (production, booking) => !booking.dirty,
  }),
  components: { AllErrorsDisplay, SquarePayment, LoadingContainer },
  props: {
    booking: {
      required: true,
      type: Booking,
    },
  },
  data() {
    return {
      paymentForm: null,
      errors: null,
      loading: false,
      squareErrors: [],
      progressPopup: null,
      enabledDigitalWallets: {
        google: false,
        apple: false,
      },
    }
  },
  methods: {
    onPaying() {
      this.progressPopup = swal.fire({
        title: 'Confirming your booking...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })
    },
    async payFree() {
      if (this.loading) return
      this.loading = true
      try {
        const data = await performMutation(
          this.$apollo,
          {
            mutation: require('@/graphql/mutations/booking/PayBooking.gql'),
            variables: {
              id: this.booking.id,
              totalPence: this.booking.totalPrice,
              idempotencyKey: this.booking.idempotencyKey,
            },
          },
          'payBooking'
        )
        this.onBookingComplete(data.payBooking.booking.reference)
      } catch (e) {
        this.errors = getValidationErrors(e)
        this.booking.refreshIdempotencyKey()
        this.loading = false
      }
    },
    async onNonceRecieved(paymentData) {
      try {
        const data = await performMutation(
          this.$apollo,
          {
            mutation: require('@/graphql/mutations/booking/PayBooking.gql'),
            variables: {
              id: this.booking.id,
              nonce: paymentData.nonce,
              totalPence: this.booking.totalPrice,
              idempotencyKey: this.booking.idempotencyKey,
              verifyToken: paymentData.verifyToken,
            },
          },
          'payBooking'
        )

        this.onBookingComplete(data.payBooking.booking.reference)
      } catch (e) {
        this.errors = getValidationErrors(e)
        this.booking.refreshIdempotencyKey()
      }
      this.progressPopup.close()
    },
    onBookingComplete(reference) {
      this.$emit('paid')
      swal
        .fire({
          icon: 'success',
          title: 'Payment Confirmed!',
          text: 'Taking you to your booking...',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          allowEscapeKey: false,
          allowOutsideClick: false,
        })
        .then(() => {
          this.$router.push(`/user/booking/${reference}`)
        })
    },
  },
}
</script>
