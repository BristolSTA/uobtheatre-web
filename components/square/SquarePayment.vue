<template>
  <loading-container :loading="!ready">
    <div class="grid gap-4 grid-cols-1 xl:grid-cols-2">
      <div>
        <h2 class="mb-2 text-center text-white text-h2">Pay with card</h2>
        <form id="payment-form">
          <div class="space-y-3">
            <div id="card-container"></div>

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
        <h2 class="mb-2 text-white text-h2">Pay with a digital wallet</h2>
        <div id="sq-gpay-button" @click="payGPay"></div>
        <div id="sq-applepay-button" @click="payApplePay"></div>
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

export default {
  components: { LoadingContainer },
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
      timer: null,
      ready: false,
      paying: false,

      square: {
        payments: null,
        request: null,

        card: null,
        gpay: null,
        applepay: null,
      },
    }
  },
  watch: {
    paying(newVal) {
      if (newVal) this.$emit('paying')
      else this.$emit('cancelled')
    },
  },
  mounted() {
    const checkToInit = () => {
      if (typeof Square !== 'undefined') {
        clearInterval(this.timer)
        this.initSquare()
      }
    }
    checkToInit()
    this.timer = setInterval(checkToInit, 100)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    async initSquare() {
      if (this.square.payments) return

      // eslint-disable-next-line no-undef
      this.square.payments = Square.payments(
        this.$config.services.square.application_id,
        this.$config.services.square.location_id
      )

      // Init the payment request
      this.square.request = this.square.payments.paymentRequest({
        countryCode: 'GB',
        currencyCode: 'GBP',
        total: {
          amount: this.price,
          label: 'Total',
        },
      })

      // Init card payment
      this.square.card = await this.square.payments.card({
        style: {
          '.message-icon': {
            color: 'white',
          },
          '.message-text': {
            color: 'white',
          },
        },
      })
      await this.square.card.attach('#card-container')

      try {
        // Init GPay
        this.square.gpay = await this.square.payments.googlePay(
          this.square.request
        )
        this.square.gpay.attach('#sq-gpay-button', {
          buttonColor: 'white',
        })
      } catch (e) {
        // eslint-disable-next-line no-console
        if (e.name !== 'PaymentMethodUnsupportedError') console.error(e)
      }

      try {
        // Init ApplePay
        this.square.applepay = await this.square.payments.applePay(
          this.square.request
        )
        this.square.applepay.attach('#sq-applepay-button')
      } catch (e) {
        // eslint-disable-next-line no-console
        if (e.name !== 'PaymentMethodUnsupportedError') console.error(e)
      }

      this.$emit('ready')
      this.ready = true
    },
    async pay(provider) {
      this.paying = true
      this.squareErrors = []

      try {
        const result = await provider.tokenize()
        if (result.status === 'OK') {
          return this.$emit('nonceRecieved', result.token)
        }

        this.paying = false
        if (result.status !== 'Cancel') {
          this.squareErrors = result.errors.map((error) => error.message)
          this.$emit('nonceError', this.squareErrors)
        }
      } catch (e) {
        this.paying = false
        this.squareErrors = ['There was an issue processing your payment']
        this.$emit('nonceError', this.squareErrors)
      }
    },
    payCard() {
      return this.pay(this.square.card)
    },
    payGPay() {
      return this.pay(this.square.gpay)
    },
    payApplePay() {
      return this.pay(this.square.applepay)
    },
  },
}
</script>
