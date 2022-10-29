<template>
  <overview-box>
    <template #title>
      <font-awesome-icon icon="money-check-alt" class="mr-2" />
      Payment
    </template>
    <template #subtitle>
      <p class="text-h4">
        {{ new BookingStatusEnum(booking.status).name }}
        <template v-if="mainPayment && booking.status == 'PAID'">
          using
          <template v-if="mainPayment.cardBrand && mainPayment.last4">
            {{ mainPayment.cardBrand.replace('_', ' ') }} ending
            {{ mainPayment.last4 }}
          </template>
          <template v-else>
            {{ new ProviderNameEnum(mainPayment.providerName).name }}
          </template>
        </template>
      </p>
    </template>
    <table v-if="booking.transactions.length" class="my-2">
      <tr>
        <td class="pr-2">Total Paid</td>
        <td class="">:</td>
        <td class="px-2">£{{ pricePaidPounds }}</td>
      </tr>
      <tr v-if="datePaid">
        <td class="pr-2">On</td>
        <td class="">:</td>
        <td class="px-2">
          {{ datePaid | dateFormat('EEE d MMM kkkk') }}
        </td>
      </tr>
    </table>
    <template v-else> No payment recorded towards this booking </template>
  </overview-box>
</template>

<script>
import { DateTime } from 'luxon';

import OverviewBox from '../../ui/Card.vue';
import Booking from '@/classes/Booking';
import BookingStatusEnum from '@/enums/PayableStatusEnum';
import ProviderNameEnum from '@/enums/TransactionProviderNameEnum';

export default {
  name: 'PaymentOverview',
  components: { OverviewBox },
  props: {
    booking: {
      required: true,
      type: Booking
    }
  },
  data() {
    return {
      BookingStatusEnum,
      ProviderNameEnum
    };
  },
  computed: {
    mainPayment() {
      return this.booking.transactions[0];
    },
    pricePaidPounds() {
      return (
        this.booking.transactions
          .map((payment) => payment.value)
          .reduce((value1, value2) => value1 + value2, 0) / 100
      ).toFixed(2);
    },
    datePaid() {
      const newestDate = new Date(
        this.booking.transactions.reduce((payment1, payment2) => {
          if (!payment1) {
            return payment2;
          }
          const date1 = new Date(payment1.createdAt);
          const date2 = new Date(payment2.createdAt);
          return date1 < date2 ? payment2 : payment1;
        }, null).createdAt
      );

      return newestDate ? DateTime.fromJSDate(newestDate) : null;
    }
  }
};
</script>
