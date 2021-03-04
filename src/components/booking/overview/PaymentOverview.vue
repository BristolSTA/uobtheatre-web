<template>
  <overview-box>
    <template v-slot:title>
      <font-awesome-icon icon="money-check-alt" class="mr-2" />
      Payment
    </template>
    <template v-slot:subtitle>
      <p class="text-h4">
        Booking Ref : {{ booking.bookingReference.slice(0, 12) }}
      </p>
    </template>
    <table class="my-2">
      <tr>
        <td class="pr-2">Price Paid</td>
        <td class="">:</td>
        <td class="px-2">£{{ booking.total_price_pounds }}</td>
      </tr>
      <tr>
        <td class="pr-2">On</td>
        <td class="">:</td>
        <td class="px-2">
          {{ booking.performance.start | dateFormat('EEE d MMM kkkk') }}
        </td>
      </tr>
    </table>
  </overview-box>
</template>

<script>
import Booking from '@/classes/Booking';

import OverviewBox from './OverviewBox.vue';
export default {
  name: 'PaymentOverview',
  components: { OverviewBox },
  props: {
    booking: {
      required: true,
      type: Booking,
    },
  },
};
</script>
