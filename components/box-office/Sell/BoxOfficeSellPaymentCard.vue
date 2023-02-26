<template>
  <div class="p-3 bg-sta-gray-dark rounded border border-sta-orange">
    <h2 class="text-center text-h2 text-white">Payment</h2>

    <h3 class="text-center text-sta-orange text-h3">
      £{{ booking.totalPricePounds }} due
    </h3>
    <UiLoadingContainer :loading="paying">
      <UiAllErrorsDisplay class="text-center" :errors="errors" />
      <div class="grid gap-2 grid-cols-2 text-center text-white">
        <template v-if="booking.totalPrice > 0">
          <button
            v-if="enabledMethods.squarePOS && availableTerminals.length"
            class="btn p-2 bg-sta-green hover:bg-sta-green-dark rounded focus:outline-none transition-colors"
            @click="
              boxOfficeStore.terminalDevice
                ? pay(PaymentProvider['SquarePos'])
                : selectTerminal()
            "
          >
            <font-awesome-icon icon="money-bill" />
            Pay with Card
            {{
              boxOfficeStore.terminalDevice
                ? `(${boxOfficeStore.terminalDevice.name})`
                : ''
            }}
          </button>
          <button
            v-else-if="enabledMethods.manualCard"
            class="btn p-2 bg-sta-green hover:bg-sta-green-dark rounded focus:outline-none transition-colors"
            @click="paymentMode = PaymentProvider['Card']"
          >
            <font-awesome-icon icon="money-check-alt" />
            Pay using Card
          </button>
          <button
            v-if="enabledMethods.cash"
            class="p-2 bg-sta-green hover:bg-sta-green-dark rounded focus:outline-none transition-colors"
            @click="paymentMode = PaymentProvider['Cash']"
          >
            <font-awesome-icon icon="money-bill" />
            Pay with Cash
          </button>
        </template>
        <button
          v-else
          class="p-2 bg-sta-green hover:bg-sta-green-dark rounded focus:outline-none transition-colors"
          @click="pay(undefined)"
        >
          <font-awesome-icon icon="money-bill" />
          Complete Booking
        </button>
      </div>
      <div
        v-if="paymentMode == PaymentProvider['Cash']"
        class="my-2 text-white"
      >
        <div class="py-2 text-center text-xl">Change Calculator</div>
        <div class="grid gap-2 grid-cols-2">
          <div class="flex items-center w-full">
            <span class="mx-2 text-xl font-semibold">£</span>
            <input
              v-model.number="amountTendered"
              type="text"
              class="p-1 w-full text-gray-800 rounded outline-none"
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
          class="p-2 bg-sta-orange hover:bg-sta-orange-dark rounded animate-pulse"
          @click="paymentMode ? pay(paymentMode) : null"
        >
          <strong>Click Here When Payment Processed ({{ paymentMode }})</strong>
        </button>
      </div>
      <template v-if="paymentMode == 'SQUARE_POS'" #overlay>
        <div>
          <button
            class="mt-4 p-2 bg-sta-rouge hover:bg-sta-rouge-dark rounded transition-colors"
            @click="cancelSquarePOSPayment"
          >
            Cancel
          </button>
        </div>
      </template>
    </UiLoadingContainer>
  </div>
</template>

<script lang="ts" setup>
import Booking from '~~/classes/Booking';
import useBoxOfficeStore from '~~/store/box-office';
import { IdInput } from '~~/types/generic';
import {
  PaymentProvider,
  PayBookingMutation,
  useCancelPaymentMutation,
  usePayBookingMutation,
  useSetBookingUserMutation,
  BookingStatus,
  useBoxOfficePerformanceBookingQuery
} from '~~/graphql/codegen/operations';
import Errors from '~~/classes/Errors';
import { DateTime } from 'luxon';
import { mutateTicketCheckInState } from '~~/services/ticketScanService';

const enabledMethods = {
  cash: true,
  manualCard: false,
  squarePOS: true
};

const boxOfficeStore = useBoxOfficeStore();
const props = defineProps<{
  booking: Booking;
  userEmail: string;
}>();

if (!props.booking.id || !props.booking.performance)
  throw new Error('Booking does not have an ID/performance');

const amountTendered = ref<number | undefined>();
const paying = ref(false);
const inProgressPaymentId = ref<IdInput | undefined>();
const paymentMode = ref<PaymentProvider | undefined>();
const errors = ref<Errors | undefined>();

const availableTerminals =
  await boxOfficeStore.retrieveAvailableTerminalDevices();

// If we already have a device, let's check it's still good
if (
  boxOfficeStore.terminalDevice &&
  !availableTerminals.find(
    (device) => device && device === boxOfficeStore.terminalDevice?.id
  )
) {
  // This terminal no longer in the list, so we'll get rid
  boxOfficeStore.$patch({ terminalDevice: undefined });
}

const { onResult: onBookingRefreshResult } =
  useBoxOfficePerformanceBookingQuery(
    {
      bookingId: props.booking.id,
      performanceId: props.booking.performance?.id
    },
    () => ({
      pollInterval: 1000,
      enabled: paying.value && paymentMode.value == PaymentProvider['SquarePos']
    })
  );

onBookingRefreshResult(({ data }) => {
  const booking = data.performance?.bookings.edges[0]?.node;
  if (booking && booking?.status == BookingStatus['Paid']) {
    bookingCompleted(booking);
  }
});

const cashChange = computed(() => {
  if (
    !amountTendered.value ||
    amountTendered.value < +props.booking.totalPricePounds
  ) {
    return '';
  }
  return (amountTendered.value - +props.booking.totalPricePounds).toFixed(2);
});

function cancelSquarePOSPayment() {
  paying.value = false;
  paymentMode.value = undefined;
  if (inProgressPaymentId.value) {
    try {
      doMutation(
        useCancelPaymentMutation({
          variables: {
            paymentId: inProgressPaymentId.value
          }
        }),
        'cancelPayment'
      );
    } catch (e) {
      errors.value = getValidationErrors(e);
    }
  }
  props.booking.refreshIdempotencyKey();
  inProgressPaymentId.value = undefined;
}

async function selectTerminal() {
  const terminalOptions = Object.fromEntries(
    availableTerminals.map((device, index) => [index, device.name])
  );

  const { value } = await swal.fire({
    title: 'Select a payment device',
    input: 'select',
    inputOptions: terminalOptions,
    showCancelButton: true
  });

  const device = value !== null ? availableTerminals[value] : null;
  if (device) {
    boxOfficeStore.$patch({ terminalDevice: device });
  }
}

async function pay(method: PaymentProvider | undefined) {
  if (paying.value || !props.booking.id) {
    return;
  }
  paying.value = true;
  paymentMode.value = method;

  try {
    // Set the booking's user
    await doMutation(
      useSetBookingUserMutation({
        variables: {
          id: props.booking.id,
          email: props.userEmail
        }
      }),
      'booking'
    );

    // Do the payment
    const data = await doMutation(
      usePayBookingMutation({
        variables: {
          id: props.booking.id,
          totalPence: props.booking.totalPrice,
          provider: method,
          idempotencyKey: props.booking.idempotencyKey,
          deviceId: boxOfficeStore.terminalDevice?.deviceId
        }
      }),
      'payBooking'
    );

    inProgressPaymentId.value = data.payment?.id;

    if (data.payment?.status !== 'COMPLETED') {
      return;
    }

    return bookingCompleted(data.booking);
  } catch (e) {
    errors.value = getValidationErrors(e);
    props.booking.refreshIdempotencyKey();
    paying.value = false;
  }
}

async function bookingCompleted(
  bookingData: NonNullable<PayBookingMutation['payBooking']>['booking']
) {
  paying.value = false;
  if (bookingData) {
    props.booking.updateFromAPIData(bookingData);

    // Check if we should check in the booking
    if (DateTime.fromISO(bookingData?.performance.doorsOpen) < DateTime.now()) {
      await mutateTicketCheckInState(
        bookingData?.performance.id,
        bookingData?.reference,
        true,
        bookingData.tickets
          ?.filter((ticket) => ticket !== null)
          .map((ticket) => ticket.id) as IdInput[]
      );
    }
  }

  successToast.fire({ title: 'Booking Completed!' });
  useRouter().push(
    `/box-office/${bookingData?.performance.id}?booking=${bookingData?.id}`
  );
  boxOfficeStore.inProgressBooking = new Booking();
}
</script>
