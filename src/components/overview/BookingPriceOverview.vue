<template>
  <overview-box>
    <template v-slot:title>Price</template>
    <table>
      <tr v-for="(cost, index) in costs" :key="index">
        <td class="pr-4">
          <p class="font-semibold">{{ cost.name }}</p>
          <small v-if="cost.subtext">{{ cost.subtext }}</small>
        </td>
        <td class="px-2">:</td>
        <td class="px-2">£{{ cost.cost }}</td>
      </tr>
    </table>
    <h3 class="text-h3">
      Order Total:
      <span class="text-sta-orange">£{{ booking.total_price_pounds }}</span>
    </h3>
  </overview-box>
</template>

<script>
import OverviewBox from '@/components/overview/OverviewBox.vue';

export default {
  name: 'booking-price-overview',
  components: { OverviewBox },
  props: {
    booking: {
      required: true,
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
          cost: misc_cost.value_pounds,
        });
      });

      return costs;
    },
  },
};
</script>
