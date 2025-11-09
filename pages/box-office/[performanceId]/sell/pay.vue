<template>
  <div>
    <NuxtLink
      :href="`/box-office/${performance?.id}/sell`"
      class="text-white hover:text-gray-300 font-bold"
      ><font-awesome-icon icon="arrow-left" /> Edit Booking</NuxtLink
    >
  </div>
  <div v-if="booking.id" class="mt-4">
    <div class="grid gap-2 md:grid-cols-2">
      <BookingOverviewTicketsOverview :booking="booking" />

      <BookingPriceOverview :booking="booking" />

      <div
        class="p-3 bg-sta-gray-dark rounded-sm border"
        :class="[!validEmail ? 'border-sta-orange' : 'border-transparent']"
      >
        <h2 class="text-center text-h2 text-white">Customer Details</h2>
        <UiFormLabel>
          Customer Email Address
          <template #control>
            <UiInputText
              ref="customerEmailInput"
              v-model="customerEmail"
              name="Email"
              type="email"
              required
            />
          </template>
          <template #helperAfter
            >We collect the customers's email to send them their receipt and to
            help process refunds. We never send unsolicited emails</template
          >
        </UiFormLabel>
      </div>

      <BoxOfficeSellPaymentCard
        v-if="validEmail"
        :booking="booking"
        :user-email="customerEmail"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { UiInputText } from '#components';
import useBoxOfficeStore from '~~/store/box-office';

const performance = inject(injectionKeys.boxOffice.performance);

if (!performance)
  throw createSafeError('There was an issue loading this performance');

const router = useRouter();

const boxOfficeStore = useBoxOfficeStore();
const booking = computed(() => boxOfficeStore.inProgressBooking);

if (!booking.value.id) router.replace(`/box-office/${performance.id}/sell`);

const customerEmail = ref<string>('');
const customerEmailInput = ref<InstanceType<typeof UiInputText> | null>(null);

const validEmail = computed(() => /\S+@\S+\.\S+/.test(customerEmail.value));

onMounted(() => {
  customerEmailInput.value?.focus();
});
</script>
