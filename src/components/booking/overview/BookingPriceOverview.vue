<template>
  <overview-box>
    <template v-slot:title>
      <font-awesome-icon icon="money-check-alt" class="mr-2" />
      Price
    </template>
    <table class="my-2">
      <tr v-for="(cost, index) in costs" :key="index">
        <td class="pr-4">
          <p class="font-semibold">{{ cost.name }}</p>
          <small v-if="cost.subtext">{{ cost.subtext }}</small>
        </td>
        <td class="px-2">:</td>
        <td class="px-2">£{{ cost.cost }}</td>
      </tr>
    </table>
    <div class="p-1 px-2 text-center rounded bg-sta-gray">
      <h3 ref="total" class="text-h3">
        Order Total:
        <span class="px-4 text-sta-orange">
          £{{ booking.total_price_pounds }}
        </span>
      </h3>
    </div>
  </overview-box>
</template>

<script>
import Booking from '@/classes/Booking';

import OverviewBox from './OverviewBox.vue';
export default {
  name: 'BookingPriceOverview',
  components: { OverviewBox },
  props: {
    booking: {
      required: true,
      type: Booking,
    },
  },
  computed: {
    costs() {
      let costs = [
        {
          name: 'Tickets',
          subtext: 'Including any discounts',
          cost: this.booking.tickets_discounted_price_pounds,
        },
      ];

      this.booking.misc_costs.forEach((misc_cost) => {
        costs.push({
          name: misc_cost.name,
          cost: (misc_cost.value / 100).toFixed(2),
        });
      });

      return costs;
    },
  },
};
</script>
