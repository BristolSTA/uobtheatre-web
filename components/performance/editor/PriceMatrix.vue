<template>
  <div>
    <safe-table>
      <table-row :striped="false">
        <table-head-item class="font-normal relative text-xs xl:text-sm">
          <div style="width: 250px">
            <div
              class="absolute cell-right-to-left-diagonal p-2 pt-4 top-0 min-h-full w-full"
            />
            <div class="absolute top-3 right-2 w-20 xl:w-40 text-right">
              Percentage Discount
            </div>
            <div class="absolute left-2 bottom-2 w-20 xl:w-40 text-left">
              Seat Group Price
            </div>
          </div>
        </table-head-item>
        <table-head-item
          v-for="discount in singleDiscounts"
          :key="discount.id"
          :text-left="false"
          class="pb-2"
        >
          <form-label label-class="">
            {{ discount.requirements[0].concessionType.name }}
            <UiBadge
              v-if="discount.performances.edges.length > 1"
              class="bg-blue-400"
            >
              <font-awesome-icon icon="sync" />
            </UiBadge>
            <template #control>
              <percentage-input
                v-if="editing"
                :key="discount.id"
                :model-value="discount.percentage * 100"
                @update:model-value="setDiscountPercentage(discount, $event)"
              />
              <div v-else class="font-bold">
                {{ discount.percentage * 100 }}%
              </div>
            </template>
          </form-label>
        </table-head-item>
      </table-row>
      <table-row
        v-for="performanceSeatGroup in performanceSeatGroups"
        :key="performanceSeatGroup.id"
        class="odd:bg-sta-gray even:bg-sta-gray-dark"
      >
        <table-head-item
          :text-left="false"
          class="p-2 break-words"
          style="width: 250px"
        >
          <form-label label-class="text-sta-orange">
            {{ performanceSeatGroup.seatGroup.name }}
            <template #control>
              <div v-if="editing" class="flex justify-center">
                <div class="w-20">
                  <currency-input
                    :key="performanceSeatGroup.id"
                    :model-value="performanceSeatGroup.price / 100"
                    placeholder="Base Price"
                    @update:model-value="
                      (event) => {
                        performanceSeatGroup.price = event * 100;
                        performanceSeatGroup._priceModified = true;
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
        </table-head-item>
        <table-row-item v-for="discount in singleDiscounts" :key="discount.id">
          <div v-if="discount.percentage != null" class="text-center">
            £{{ displayPrice(performanceSeatGroup, discount) }}
          </div>
        </table-row-item>
      </table-row>
    </safe-table>
    <div v-if="editing" class="m-2 p-2 bg-sta-gray-dark">
      Note:
      <UiBadge class="bg-blue-400">
        <font-awesome-icon icon="sync" />
      </UiBadge>
      Denotates a setting that is synced or shared across multiple performances.
      By changing this, it will change for the other performances too
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import FormLabel from '@/components/ui/FormLabel.vue';
import Badge from '~~/components/ui/UiBadge.vue';
import CurrencyInput from '@/components/ui/Input/CurrencyInput.vue';
import PercentageInput from '@/components/ui/Input/PercentageInput.vue';
import { getSingleDiscounts as singleDiscountsFn } from '@/utils/performance';
import TableHeadItem from '@/components/ui/Tables/TableHeadItem.vue';
import SafeTable from '@/components/ui/Tables/SafeTable.vue';
import TableRow from '@/components/ui/Tables/TableRow.vue';
import TableRowItem from '@/components/ui/Tables/TableRowItem.vue';
export default defineNuxtComponent({
  components: {
    FormLabel,
    Badge,
    CurrencyInput,
    PercentageInput,
    TableHeadItem,
    SafeTable,
    TableRow,
    TableRowItem
  },
  props: {
    editing: {
      default: false,
      type: Boolean
    },
    performanceSeatGroups: {
      type: Array,
      required: true
    },
    discounts: {
      required: true,
      type: Array
    }
  },
  computed: {
    singleDiscounts() {
      return singleDiscountsFn(this.discounts);
    }
  },
  watch: {
    performanceSeatGroups: {
      deep: true,
      handler() {
        this.$forceUpdate();
      }
    }
  },
  methods: {
    displayPrice(performanceSeatGroup, discount) {
      // Get the value the API says this should be at the moment
      const discountConcessionType = discount.requirements[0].concessionType;
      const currentValue =
        performanceSeatGroup.concessionTypes &&
        performanceSeatGroup.concessionTypes.find((concessionType) => {
          return concessionType.concessionType.id === discountConcessionType.id;
        })?.price;

      if (
        performanceSeatGroup._priceModified ||
        discount._percentageModified ||
        typeof currentValue !== 'number'
      ) {
        return (
          Math.ceil(performanceSeatGroup.price * (1 - discount.percentage)) /
          100
        ).toFixed(2);
      }
      return (currentValue / 100).toFixed(2);
    },
    setDiscountPercentage(discountObject, integerPercentage) {
      discountObject.percentage = integerPercentage / 100;
      discountObject._percentageModified = true;
    }
  }
});
</script>
