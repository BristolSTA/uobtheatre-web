<template>
  <div>
    <div class="p-2 mb-2 md:text-center bg-sta-gray-light">
      <p class="text-white text-h3">
        {{ booking.performance.production.name }}
      </p>
      <p class="text-sta-orange">
        {{ booking.performance.start | dateFormat('cccc d MMM') }}, Starting at
        {{ booking.performance.start | dateFormat('T') }}
      </p>
      <p class="text-sta-orange">
        {{ booking.tickets.length }} Ticket{{
          booking.tickets.length > 1 ? 's' : ''
        }}
      </p>
    </div>
    <all-errors-display class="text-center" :errors="errors" />
    <div class="grid grid-cols-2">
      <div>
        <h2 class="mb-2 text-center text-white text-h2">Pay with card</h2>
        <div class="container space-y-3">
          <div id="sq-card-number"></div>
          <div class="grid grid-cols-3 gap-3">
            <div id="sq-expiration-date"></div>
            <div id="sq-cvv"></div>
            <div id="sq-postal-code"></div>
          </div>

          <div
            v-if="squareErrors.length"
            class="p-2 text-white border-2 border-sta-rouge"
          >
            Whoops! There was an error with your details:
            <ul class="list-disc list-inside">
              <li v-for="(item, index) in squareErrors" :key="index">
                {{ item }}
              </li>
            </ul>
          </div>

          <button
            id="sq-creditcard"
            class="w-full btn btn-orange"
            @click.prevent="onPayClick"
            @keypress.prevent="onPayClick"
          >
            Pay £{{ booking.total_price_pounds }}
          </button>
        </div>
      </div>
      <div
        v-show="Object.values(enabledDigitalWallets).find((val) => !!val)"
        class="text-center"
      >
        <h2 class="mb-2 text-white text-h2">Pay with a digital wallet</h2>
        <button
          v-show="enabledDigitalWallets.google"
          id="sq-google-pay"
          class="button-google-pay"
        ></button>
        <button
          v-show="enabledDigitalWallets.apple"
          id="sq-apple-pay"
          class="apple-pay-button apple-pay-button-white"
        ></button>
      </div>
    </div>
    <p class="mt-4 text-center text-sta-gray-lighter">
      Your payment is handled securely by Square. We do not directly store or
      process your card details.
    </p>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import Swal from 'sweetalert2';

import Booking from '@/classes/Booking';
import AllErrorsDisplay from '@/components/ui/AllErrorsDisplay.vue';
import config from '@/config';
import { performMutation, swal } from '@/utils';
export default {
  name: 'PaymentStage',
  components: { AllErrorsDisplay },
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
      squareErrors: [],
      progressPopup: null,
      enabledDigitalWallets: {
        google: false,
        apple: false,
      },
    };
  },
  mounted() {
    this.setupForm();
  },
  methods: {
    setupForm() {
      // eslint-disable-next-line no-undef
      this.paymentForm = new SqPaymentForm({
        applicationId: config.services.square.application_id,
        locationId: config.services.square.location_id,
        inputClass: 'sq-input',
        autoBuild: false,
        inputStyles: [
          {
            fontSize: '16px',
            lineHeight: '24px',
            padding: '16px',
            placeholderColor: '#a0a0a0',
            color: '#fff',
            backgroundColor: 'transparent',
          },
        ],
        cardNumber: {
          elementId: 'sq-card-number',
          placeholder: 'Card Number',
        },
        cvv: {
          elementId: 'sq-cvv',
          placeholder: 'CVV',
        },
        expirationDate: {
          elementId: 'sq-expiration-date',
          placeholder: 'MM/YY',
        },
        postalCode: {
          elementId: 'sq-postal-code',
          placeholder: 'Post Code',
        },
        googlePay: {
          elementId: 'sq-google-pay',
        },
        applePay: {
          elementId: 'sq-apple-pay',
        },
        callbacks: {
          cardNonceResponseReceived: this.onNonceRecieved,
          methodsSupported: this.onMethodsSupported,
          createPaymentRequest: this.onCreatePaymentRequest,
        },
      });
      this.paymentForm.build();
    },
    onPayClick() {
      this.progressPopup = swal.fire({
        title: 'Confirming your booking...',
        didOpen: () => {
          Swal.showLoading();
        },
      });
      this.paymentForm.requestCardNonce();
    },
    async onNonceRecieved(errors, nonce) {
      this.squareErrors = [];
      if (errors) {
        this.squareErrors = errors.map((error) => error.message);
        this.progressPopup.close();
        return;
      }

      try {
        let data = await performMutation(
          this.$apollo,
          {
            mutation: gql`
            mutation(
              $bookingID: IdInputField!
              $nonce: String!
              $totalPrice: Int!
            ) {
              payBooking(
                bookingId: $bookingID
                nonce: $nonce
                price: $totalPrice
              ) {
                payment {
                  value
                  currency
                  cardBrand
                  last4
                }
                booking {
                  reference
                }
                ${require('@/graphql/partials/ErrorsPartial').default}
              }
            }
          `,
            variables: {
              bookingID: this.booking.id,
              nonce: nonce,
              totalPrice: this.booking.total_price,
            },
          },
          'payBooking'
        );
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
            this.$router.push({
              name: 'user.booking',
              params: { bookingRef: data.payBooking.booking.reference },
            });
          });
      } catch ({ errors }) {
        this.errors = errors;
      }

      this.progressPopup.close();
    },
    onMethodsSupported(methods) {
      if (methods.googlePay === true) {
        this.enabledDigitalWallets.google = true;
      }
      if (methods.applePay === true) {
        this.enabledDigitalWallets.apple = true;
      }
    },
    onCreatePaymentRequest() {
      // Used to create payment request for GPay
      return {
        requestShippingAddress: false,
        requestBillingInfo: true,
        currencyCode: 'GBP',
        countryCode: 'GB',
        total: {
          label: 'UOB Theatre',
          amount: this.booking.total_price_pounds,
          pending: false,
        },
      };
    },
  },
};
</script>

<style lang="scss">
/* Define how SqPaymentForm iframes should look */
.sq-input {
  height: 56px;
  box-sizing: border-box;
  display: inline-block;
  @apply bg-sta-gray;
  @apply text-white;
  @apply rounded-lg;
}

/* Define how SqPaymentForm iframes should look when they have focus */
.sq-input--focus {
  @apply border;
  @apply border-sta-green;
}

/* Define how SqPaymentForm iframes should look when they contain invalid values */
.sq-input--error {
  @apply border-2;
  @apply border-sta-rouge;
}

.button-google-pay {
  display: inline-block;
  min-width: 200px;
  min-height: 40px;
  padding: 11px 24px;
  margin: 10px;
  background-color: #fff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='41' height='17'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M19.526 2.635v4.083h2.518c.6 0 1.096-.202 1.488-.605.403-.402.605-.882.605-1.437 0-.544-.202-1.018-.605-1.422-.392-.413-.888-.62-1.488-.62h-2.518zm0 5.52v4.736h-1.504V1.198h3.99c1.013 0 1.873.337 2.582 1.012.72.675 1.08 1.497 1.08 2.466 0 .991-.36 1.819-1.08 2.482-.697.665-1.559.996-2.583.996h-2.485v.001zm7.668 2.287c0 .392.166.718.499.98.332.26.722.391 1.168.391.633 0 1.196-.234 1.692-.701.497-.469.744-1.019.744-1.65-.469-.37-1.123-.555-1.962-.555-.61 0-1.12.148-1.528.442-.409.294-.613.657-.613 1.093m1.946-5.815c1.112 0 1.989.297 2.633.89.642.594.964 1.408.964 2.442v4.932h-1.439v-1.11h-.065c-.622.914-1.45 1.372-2.486 1.372-.882 0-1.621-.262-2.215-.784-.594-.523-.891-1.176-.891-1.96 0-.828.313-1.486.94-1.976s1.463-.735 2.51-.735c.892 0 1.629.163 2.206.49v-.344c0-.522-.207-.966-.621-1.33a2.132 2.132 0 0 0-1.455-.547c-.84 0-1.504.353-1.995 1.062l-1.324-.834c.73-1.045 1.81-1.568 3.238-1.568m11.853.262l-5.02 11.53H34.42l1.864-4.034-3.302-7.496h1.635l2.387 5.749h.032l2.322-5.75z' fill='%235F6368'/%3E%3Cpath d='M13.448 7.134c0-.473-.04-.93-.116-1.366H6.988v2.588h3.634a3.11 3.11 0 0 1-1.344 2.042v1.68h2.169c1.27-1.17 2.001-2.9 2.001-4.944' fill='%234285F4'/%3E%3Cpath d='M6.988 13.7c1.816 0 3.344-.595 4.459-1.621l-2.169-1.681c-.603.406-1.38.643-2.29.643-1.754 0-3.244-1.182-3.776-2.774H.978v1.731a6.728 6.728 0 0 0 6.01 3.703' fill='%2334A853'/%3E%3Cpath d='M3.212 8.267a4.034 4.034 0 0 1 0-2.572V3.964H.978A6.678 6.678 0 0 0 .261 6.98c0 1.085.26 2.11.717 3.017l2.234-1.731z' fill='%23FABB05'/%3E%3Cpath d='M6.988 2.921c.992 0 1.88.34 2.58 1.008v.001l1.92-1.918C10.324.928 8.804.262 6.989.262a6.728 6.728 0 0 0-6.01 3.702l2.234 1.731c.532-1.592 2.022-2.774 3.776-2.774' fill='%23E94235'/%3E%3Cpath d='M0 0h41.285v18H0z'/%3E%3C/g%3E%3C/svg%3E");
  background-origin: content-box;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  border: 0;
  border-radius: 4px;
  box-shadow: 0 1px 1px 0 rgba(60, 64, 67, 0.3),
    0 1px 3px 1px rgba(60, 64, 67, 0.15);
  outline: 0;
  cursor: pointer;
}
@supports (-webkit-appearance: -apple-pay-button) {
  .apple-pay-button {
    display: inline-block;
    -webkit-appearance: -apple-pay-button;
    -apple-pay-button-type: buy;
  }
  .apple-pay-button-white {
    -apple-pay-button-style: white;
  }
  .apple-pay-button-white-with-line {
    -apple-pay-button-style: white-outline;
  }
}

@supports not (-webkit-appearance: -apple-pay-button) {
  .apple-pay-button {
    display: inline-block;
    background-size: 100% 60%;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    border-radius: 5px;
    padding: 0px;
    box-sizing: border-box;
    min-width: 200px;
    min-height: 32px;
    max-height: 64px;
  }
  .apple-pay-button-black {
    background-image: -webkit-named-image(apple-pay-logo-white);
    background-color: black;
  }
  .apple-pay-button-white {
    background-image: -webkit-named-image(apple-pay-logo-black);
    background-color: white;
  }
  .apple-pay-button-white-with-line {
    background-image: -webkit-named-image(apple-pay-logo-black);
    background-color: white;
    border: 0.5px solid black;
  }
}
</style>
