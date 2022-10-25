<template>
  <overview-box>
    <template #title>
      <font-awesome-icon icon="money-check-alt" class="mr-2" />
      Price
    </template>
    <table class="my-2">
      <tr v-for="(cost, index) in costs" :key="index">
        <td class="pr-4">
          <p class="font-semibold">
            {{ cost.name }}
          </p>
          <small v-if="cost.subtext">{{ cost.subtext }}</small>
        </td>
        <td class="px-2">:</td>
        <td class="px-2 font-mono">£{{ cost.cost }}</td>
      </tr>
    </table>
    <div class="p-1 px-2 text-center bg-sta-gray rounded">
      <h3 ref="total" class="text-h3">
        Order Total:
        <span class="px-4 text-sta-orange">
          £{{ booking.totalPricePounds }}
        </span>
      </h3>
    </div>
  </overview-box>
</template>

<script>
import OverviewBox from "../../ui/Card.vue";
import Booking from "@/classes/Booking";

export default {
  name: "BookingPriceOverview",
  components: { OverviewBox },
  props: {
    booking: {
      required: true,
      type: Booking,
    },
  },
  computed: {
    costs() {
      const costs = [
        {
          name: "Tickets",
          subtext: "Including any discounts",
          cost: this.booking.ticketsDiscountedPricePounds,
        },
      ];

      this.booking.miscCosts.forEach((miscCost) => {
        costs.push({
          name: miscCost.name,
          cost: (miscCost.value / 100).toFixed(2),
        });
      });

      return costs;
    },
  },
};
</script>
