<template>
  <loading-container :loading="!ready">
    <div class="grid gap-4 grid-cols-1 xl:grid-cols-2">
      <div>
        <h2 class="mb-2 text-center text-white text-h2">
          Pay with card
        </h2>
        <form id="payment-form">
          <div class="space-y-3">
            <div id="card-container" />

            <button
              id="card-button"
              type="button"
              class="btn btn-orange w-full"
              :disabled="!ready"
              @click.prevent="payCard"
              @keypress.prevent="payCard"
            >
              Pay £{{ price }}
            </button>
          </div>
        </form>
      </div>
      <div class="text-center">
        <h2 class="mb-2 text-white text-h2">
          Pay with a digital wallet
        </h2>
        <div
          id="sq-gpay-button"
          @click="square.methods.gpay ? payGPay() : null"
        />
        <div
          id="sq-applepay-button"
          @click="square.methods.applepay ? payApplePay() : null"
        />
      </div>
    </div>

    <div
      v-if="squareErrors.length"
      class="mt-4 p-2 text-center text-white border-2 border-sta-rouge"
    >
      Whoops! There was an error with your payment:
      <ul class="list-inside list-disc">
        <li v-for="(item, index) in squareErrors" :key="index">
          {{ item }}
        </li>
      </ul>
    </div>
  </loading-container>
</template>

<script>
import LoadingContainer from '@/components/ui/LoadingContainer.vue'
import { silentErrorHandler } from '@/utils'

export default {
  components: { LoadingContainer },
  props: {
    useWallets: {
      default: true,
      type: Boolean
    },
    price: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      squareErrors: [],
      timer: null,
      ready: false,
      paying: false,

      square: {
        payments: null,
        request: null,
        methods: null
      }
    }
  },
  watch: {
    paying (newVal) {
      if (newVal) { this.$emit('paying') } else { this.$emit('cancelled') }
    }
  },
  mounted () {
    const checkToInit = () => {
      if (typeof Square !== 'undefined') {
        clearInterval(this.timer)
        this.initSquare()
      }
    }
    checkToInit()
    this.timer = setInterval(checkToInit, 100)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  methods: {
    async initSquare () {
      if (this.square.payments) { return }

      // eslint-disable-next-line no-undef
      this.square.payments = Square.payments(
        this.$config.services.square.application_id,
        this.$config.services.square.location_id
      )

      this.square.methods = {}

      // Init the payment request
      this.square.request = this.square.payments.paymentRequest({
        countryCode: 'GB',
        currencyCode: 'GBP',
        total: {
          amount: this.price,
          label: 'Total'
        }
      })

      // Init card payment
      this.square.methods.card = await this.square.payments.card({
        style: {
          '.message-icon': {
            color: 'white'
          },
          '.message-text': {
            color: 'white'
          }
        }
      })
      await this.square.methods.card.attach('#card-container')

      try {
        // Init GPay
        this.square.methods.gpay = await this.square.payments.googlePay(
          this.square.request
        )
        await this.square.methods.gpay.attach('#sq-gpay-button', {
          buttonColor: 'white'
        })
      } catch (e) {
        if (e.name !== 'PaymentMethodUnsupportedError') { silentErrorHandler(e) }
      }

      try {
        // Init ApplePay
        this.square.methods.applepay = await this.square.payments.applePay(
          this.square.request
        )
      } catch (e) {
        if (e.name !== 'PaymentMethodUnsupportedError') { silentErrorHandler(e) }
      }

      this.$emit('ready')
      this.ready = true
    },
    async verifyBuyer (token) {
      const details = {
        amount: this.price,
        billingContact: {},
        currencyCode: 'GBP',
        intent: 'CHARGE'
      }
      const results = await this.square.payments.verifyBuyer(token, details)
      return results.token
    },
    async pay (provider, verify = false) {
      this.paying = true
      this.squareErrors = []

      try {
        const result = await provider.tokenize()
        if (result.status === 'OK') {
          const paymentData = { nonce: result.token }
          if (verify) { paymentData.verifyToken = await this.verifyBuyer(result.token) }
          return this.$emit('nonceRecieved', paymentData)
        }

        this.paying = false
        if (result.status !== 'Cancel') {
          this.squareErrors = result.errors.map(error => error.message)
          this.$emit('nonceError', this.squareErrors)
        }
      } catch (e) {
        this.paying = false
        this.squareErrors = [
          'An unexpected error was encountered whilst trying to process your payment. No charge has been made.'
        ]
        silentErrorHandler(e)
        this.$emit('nonceError', this.squareErrors)
      }
    },
    payCard () {
      return this.pay(this.square.methods.card, true)
    },
    payGPay () {
      return this.pay(this.square.methods.gpay)
    },
    payApplePay () {
      return this.pay(this.square.methods.applepay)
    }
  }
}
</script>

<style>
#sq-applepay-button {
  height: 48px;
  width: 240px;
  max-width: 100%;
  margin-top: 1em;
  display: inline-block;
  cursor: pointer;
  -webkit-appearance: -apple-pay-button;
  -apple-pay-button-type: plain;
  -apple-pay-button-style: black;
}
</style>
