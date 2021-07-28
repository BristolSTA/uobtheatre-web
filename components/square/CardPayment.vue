<template>
  <div class="space-y-3">
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
      Whoops! There was an error with your payment:
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
      Pay £{{ price }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    useWallets: {
      default: true,
      type: Boolean,
    },
    price: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      squareErrors: [],
      paymentForm: null,
      timer: null,
    }
  },
  destroyed() {
    if (this.paymentForm) this.paymentForm.destroy()
  },
  mounted() {
    this.timer = setInterval(() => {
      // eslint-disable-next-line no-undef
      if (typeof SqPaymentForm !== 'undefined') {
        clearInterval(this.timer)
        this.initSquare()
      }
    }, 100)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    initSquare() {
      const squareOptions = {
        applicationId: this.$config.services.square.application_id,
        locationId: this.$config.services.square.location_id,
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
        callbacks: {
          cardNonceResponseReceived: this.onNonceRecieved,
          methodsSupported: this.onMethodsSupported,
          createPaymentRequest: this.onCreatePaymentRequest,
        },
      }
      if (this.useWallets) {
        Object.assign(squareOptions, {
          googlePay: {
            elementId: 'sq-google-pay',
          },
          applePay: {
            elementId: 'sq-apple-pay',
          },
        })
      }
      // eslint-disable-next-line no-undef
      this.paymentForm = new SqPaymentForm(squareOptions)
      this.paymentForm.build()
    },
    onPayClick() {
      this.paymentForm.requestCardNonce()
      this.$emit('paying')
    },
    onNonceRecieved(errors, nonce) {
      this.squareErrors = []
      if (errors) {
        this.squareErrors = errors.map((error) => error.message)
        return this.$emit('nonceError', this.squareErrors)
      }

      return this.$emit('nonceRecieved', nonce)
    },
    onMethodsSupported(methods, unsupportedReason) {
      if (methods.googlePay === true) {
        this.$emit('enableGPay')
      }
      if (methods.applePay === true) {
        this.$emit('enableApplePay')
      }
      // eslint-disable-next-line no-console
      if (unsupportedReason) console.debug(methods, unsupportedReason)
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
          amount: this.price,
          pending: false,
        },
      }
    },
  },
}
</script>
