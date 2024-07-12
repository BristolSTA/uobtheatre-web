<template>
  <loading-container :loading="!ready">
    <div class="grid gap-4 grid-cols-1 xl:grid-cols-2">
      <div>
        <h2 class="mb-2 text-center text-white text-h2">Pay with card</h2>
        <form id="payment-form">
          <div class="space-y-3">
            <div id="card-container" ref="card-container" />

            <button
              id="card-button"
              type="button"
              class="btn btn-orange w-full"
              :disabled="!ready"
              @click.stop="enabledMethods.card ? payCard() : null"
              @keypress.stop="enabledMethods.card ? payCard() : null"
            >
              Pay £{{ price }}
            </button>
          </div>
        </form>
      </div>
      <div class="text-center">
        <h2 class="mb-2 text-white text-h2">Pay with a digital wallet</h2>
        <div
          id="sq-gpay-button"
          @click="enabledMethods.gpay ? payGPay() : null"
        />
        <div
          id="sq-applepay-button"
          @click="enabledMethods.applepay ? payApplePay() : null"
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
import LoadingContainer from '@/components/ui/LoadingContainer.vue';
import { silentErrorHandler } from '@/utils/misc';

let square;

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
  emits: ['paying', 'cancelled', 'ready', 'nonceRecieved', 'nonceError'],
  data() {
    return {
      squareErrors: [],
      timer: null,
      ready: false,
      paying: false,

      enabledMethods: {
        card: true,
        gpay: false,
        applepay: false
      }
    };
  },
  watch: {
    paying(newVal) {
      if (newVal) {
        this.$emit('paying');
      }
    }
  },
  mounted() {
    square = {
      payments: null,
      request: null,
      methods: null
    };
    const checkToInit = () => {
      if (typeof Square !== 'undefined') {
        clearInterval(this.timer);
        this.initSquare();
      }
    };
    checkToInit();
    this.timer = setInterval(checkToInit, 100);
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  methods: {
    async initSquare() {
      if (square.payments) {
        return;
      }

      const config = useRuntimeConfig();

       
      square.payments = Square.payments(
        config.public.services.square.applicationId,
        config.public.services.square.locationId
      );

      square.methods = {};

      // Init the payment request
      square.request = square.payments.paymentRequest({
        countryCode: 'GB',
        currencyCode: 'GBP',
        total: {
          amount: this.price,
          label: 'Total'
        }
      });

      // Init card payment
      square.methods.card = await square.payments.card({
        style: {
          '.message-icon': {
            color: 'white'
          },
          '.message-text': {
            color: 'white'
          }
        }
      });

      await square.methods.card.attach('#card-container');

      try {
        // Init GPay
        square.methods.gpay = await square.payments.googlePay(square.request);
        this.enabledMethods.gpay = true;
        await square.methods.gpay.attach('#sq-gpay-button', {
          buttonColor: 'white'
        });
      } catch (e) {
        if (e.name !== 'PaymentMethodUnsupportedError') {
          silentErrorHandler(e);
        }
      }

      try {
        // Init ApplePay
        square.methods.applepay = await square.payments.applePay(
          square.request
        );
        this.enabledMethods.applepay = true;
      } catch (e) {
        if (e.name !== 'PaymentMethodUnsupportedError') {
          silentErrorHandler(e);
        }
      }

      this.$emit('ready');
      this.ready = true;
    },
    async verifyBuyer(token) {
      const details = {
        amount: this.price,
        billingContact: {},
        currencyCode: 'GBP',
        intent: 'CHARGE'
      };
      const results = await square.payments.verifyBuyer(token, details);
      return results.token;
    },
    onCancelled() {
      this.paying = false;
      this.$emit('cancelled');
    },
    onSuccessfulNonceGeneration(paymentData) {
      this.paying = false;
      this.$emit('nonceRecieved', paymentData);
    },
    async pay(provider, verify = false) {
      this.paying = true;
      this.squareErrors = [];

      try {
        const result = await provider.tokenize();
        if (result.status === 'OK') {
          const paymentData = { nonce: result.token };
          if (verify) {
            paymentData.verifyToken = await this.verifyBuyer(result.token);
          }
          return this.onSuccessfulNonceGeneration(paymentData);
        }

        this.onCancelled();
        if (result.status !== 'Cancel') {
          this.squareErrors = result.errors.map((error) => error.message);
          this.$emit('nonceError', this.squareErrors);
        }
      } catch (e) {
        this.onCancelled();
        this.squareErrors = [
          'An unexpected error was encountered whilst trying to process your payment. No charge has been made.'
        ];
        silentErrorHandler(e);
        this.$emit('nonceError', this.squareErrors);
      }
    },
    payCard() {
      return this.pay(square.methods.card, true);
    },
    payGPay() {
      return this.pay(square.methods.gpay);
    },
    payApplePay() {
      return this.pay(square.methods.applepay);
    }
  }
};
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
