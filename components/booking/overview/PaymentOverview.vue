<template>
  <overview-box>
    <template #title>
      <font-awesome-icon icon="money-check-alt" class="mr-2" />
      Payment
    </template>
    <template #subtitle>
      <p class="text-h4">
        {{ booking.status.description }}
        <template v-if="booking.payments[0]">
          using {{ booking.payments[0].cardBrand.replace('_', ' ') }} ending
          {{ booking.payments[0].last4 }}
        </template>
      </p>
    </template>
    <table v-if="booking.payments.length" class="my-2">
      <tr>
        <td class="pr-2">Price Paid</td>
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
import { DateTime } from 'luxon'

import Booking from '@/classes/Booking'

import OverviewBox from './OverviewBox.vue'
export default {
  name: 'PaymentOverview',
  components: { OverviewBox },
  props: {
    booking: {
      required: true,
      type: Booking,
    },
  },
  computed: {
    pricePaidPounds() {
      return (
        this.booking.payments
          .map((payment) => payment.value)
          .reduce((value1, value2) => value1 + value2, 0) / 100
      ).toFixed(2)
    },
    datePaid() {
      const newestDate = this.booking.payments.reduce((payment1, payment2) => {
        if (!payment1) return new Date(payment2.createdAt)
        const date1 = new Date(payment1.createdAt)
        const date2 = new Date(payment2.createdAt)
        return date1 < date2 ? date2 : date1
      }, null)

      return newestDate ? DateTime.fromJSDate(newestDate) : null
    },
  },
}
</script>
