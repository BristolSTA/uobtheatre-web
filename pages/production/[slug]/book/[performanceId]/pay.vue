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
        {{ dateFormat(booking.performance.start, 'cccc d MMM y') }}, Starting at
        {{ dateFormat(booking.performance.start, 'T') }}
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
          @paying="onPaying"
          @cancelled="onCancelled"
          @nonce-recieved="onNonceRecieved"
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
          class="p-2 bg-sta-green hover:bg-sta-green-dark rounded-sm focus:outline-hidden transition-colors"
          @click="payFree"
        >
          Complete Booking
          <font-awesome-icon class="ml-2" icon="arrow-right" />
        </button>
      </div>
    </loading-container>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

import Booking from '~~/classes/Booking';
import AllErrorsDisplay from '@/components/ui/AllErrorsDisplay.vue';

import { getValidationErrors, performMutation } from '~~/utils/api';
import { dateFormat } from '@/utils/datetime';
import { swal } from '~~/utils/alerts';
import BookingStage from '@/classes/BookingStage';
import SquarePayment from '@/components/square/SquarePayment.vue';
import LoadingContainer from '@/components/ui/LoadingContainer.vue';
import { PayBookingDocument } from '~~/graphql/codegen/operations';
import { recordPaymentEvent, recordEvent, events } from '~~/utils/analytics';

const stageInfo = new BookingStage({
  name: 'Payment',
  routeName: 'production-slug-book-performanceId-pay',
  eligable: (_, booking) => !booking.dirty && booking.tickets.length > 0
});

export default defineNuxtComponent({
  stageInfo,
  components: { AllErrorsDisplay, SquarePayment, LoadingContainer },
  props: {
    booking: {
      required: true,
      type: Booking
    }
  },
  emits: ['mounted', 'paid'],
  data() {
    return {
      paymentForm: null,
      errors: null,
      loading: false,
      squareErrors: [],
      progressPopup: null,
      enabledDigitalWallets: {
        google: false,
        apple: false
      }
    };
  },
  mounted() {
    this.$emit('mounted', stageInfo);
  },
  methods: {
    dateFormat,
    onPaying() {
      this.progressPopup = swal.fire({
        title: 'Confirming your booking...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      this.errors = null;
    },
    onCancelled() {
      Swal.close();
    },
    async payFree() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      try {
        const data = await performMutation(
          this.$apollo,
          {
            mutation: PayBookingDocument,
            variables: {
              id: this.booking.id,
              totalPence: this.booking.totalPrice,
              idempotencyKey: this.booking.idempotencyKey
            }
          },
          'payBooking'
        );
        this.onBookingComplete(data.payBooking.booking.reference);
      } catch (e) {
        this.errors = getValidationErrors(e);
        this.booking.refreshIdempotencyKey();
        this.loading = false;
      }
    },
    async onNonceRecieved(paymentData) {
      try {
        const data = await performMutation(
          this.$apollo,
          {
            mutation: PayBookingDocument,
            variables: {
              id: this.booking.id,
              nonce: paymentData.nonce,
              totalPence: this.booking.totalPrice,
              idempotencyKey: this.booking.idempotencyKey,
              verifyToken: paymentData.verifyToken
            }
          },
          'payBooking'
        );

        recordPaymentEvent({
          transaction_id: `booking_${this.booking.id}`,
          currency: 'GBP',
          value: this.booking.totalPrice / 100
        });
        this.onBookingComplete(data.payBooking.booking.reference);
      } catch (e) {
        Swal.close();
        this.errors = getValidationErrors(e);
        this.booking.refreshIdempotencyKey();
      }
    },
    onBookingComplete(reference) {
      this.$emit('paid');
      recordEvent(events.booking.completed);
      swal
        .fire({
          icon: 'success',
          title: 'Payment Confirmed!',
          text: 'Taking you to your booking...',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          allowEscapeKey: false,
          allowOutsideClick: false
        })
        .then(() => {
          useRouter().push(`/user/booking/${reference}`);
        });
    }
  }
});
</script>
