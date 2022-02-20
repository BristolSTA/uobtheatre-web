<template>
  <div>
    <table class="w-full">
      <tr>
        <th
          class="font-normal relative text-xs xl:text-sm"
          style="max-width: 200px"
        >
          <div
            class="
              absolute
              cell-right-to-left-diagonal
              p-2
              pt-4
              top-0
              min-h-full
              w-full
            "
          />
          <div class="absolute top-3 right-2 w-20 xl:w-40 text-right">
            Percentage Discount
          </div>
          <div class="absolute left-2 bottom-2 w-20 xl:w-40 text-left">
            Seat Group Price
          </div>
        </th>
        <th v-for="discount in singleDiscounts" :key="discount.id" class="pb-2">
          <form-label label-class="">
            {{ discount.requirements[0].concessionType.name }}
            <badge
              v-if="discount.performances.edges.length > 1"
              class="bg-blue-400"
            >
              <font-awesome-icon icon="sync" />
            </badge>
            <template #control>
              <percentage-input
                v-if="editing"
                :key="discount.id"
                :value="discount.percentage * 100"
                @blur="
                  (event) => {
                    discount.percentage = event / 100
                    discount._percentageModified = true
                  }
                "
              />
              <div v-else class="font-bold">
                {{ discount.percentage * 100 }}%
              </div>
            </template>
          </form-label>
        </th>
      </tr>
      <tr
        v-for="performanceSeatGroup in performanceSeatGroups"
        :key="performanceSeatGroup.id"
        class="odd:bg-sta-gray even:bg-sta-gray-dark"
      >
        <th class="p-2 break-words" style="max-width: 200px">
          <form-label label-class="text-sta-orange">
            {{ performanceSeatGroup.seatGroup.name }}
            <template #control>
              <div v-if="editing" class="flex justify-center">
                <div class="w-20">
                  <currency-input
                    :key="performanceSeatGroup.id"
                    :value="performanceSeatGroup.price / 100"
                    placeholder="Base Price"
                    @input="
                      (event) => {
                        performanceSeatGroup.price = event * 100
                        performanceSeatGroup._priceModified = true
                      }
                    "
                  />
                </div>
              </div>
              <div v-else class="font-bold">
                £{{ (performanceSeatGroup.price / 100).toFixed(2) }}
              </div>
            </template>
          </form-label>
        </th>
        <td v-for="discount in singleDiscounts" :key="discount.id">
          <div v-if="discount.percentage != null" class="text-center">
            £{{ displayPrice(performanceSeatGroup, discount) }}
          </div>
        </td>
      </tr>
    </table>
    <div v-if="editing" class="m-2 p-2 bg-sta-gray-dark">
      Note:
      <badge class="bg-blue-400"><font-awesome-icon icon="sync" /></badge>
      Denotates a setting that is synced or shared across multiple performances.
      By changing this, it will change for the other performances too
    </div>
  </div>
</template>

<script>
import FormLabel from '@/components/ui/FormLabel.vue'
import Badge from '@/components/ui/Badge.vue'
import CurrencyInput from '@/components/ui/Inputs/CurrencyInput.vue'
import PercentageInput from '@/components/ui/Inputs/PercentageInput.vue'
import { singleDiscounts as singleDiscountsFn } from '@/utils/performance'
export default {
  components: { FormLabel, Badge, CurrencyInput, PercentageInput },
  props: {
    editing: {
      default: false,
      type: Boolean,
    },
    performanceSeatGroups: {
      type: Array,
      required: true,
    },
    discounts: {
      required: true,
      type: Array,
    },
  },
  computed: {
    singleDiscounts() {
      return singleDiscountsFn(this.discounts)
    },
  },
  methods: {
    displayPrice(performanceSeatGroup, discount) {
      // Get the value the API says this should be at the moment
      const discountConcessionType = discount.requirements[0].concessionType
      const currentValue =
        performanceSeatGroup.concessionTypes &&
        performanceSeatGroup.concessionTypes.find((concessionType) => {
          return concessionType.concessionType.id === discountConcessionType.id
        })?.price

      if (
        performanceSeatGroup._priceModified ||
        discount._percentageModified ||
        typeof currentValue !== 'number'
      ) {
        return (
          Math.ceil(performanceSeatGroup.price * (1 - discount.percentage)) /
          100
        ).toFixed(2)
      }
      return (currentValue / 100).toFixed(2)
    },
  },
}
</script>
