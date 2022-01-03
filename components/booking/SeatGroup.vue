<template>
  <div class="text-white">
    <div
      ref="header"
      class="flex pl-4 py-2 hover:bg-opacity-80"
      :class="[
        expanded
          ? 'bg-sta-orange'
          : available
          ? 'bg-sta-green'
          : 'bg-sta-gray-dark border-2 border-sta-rouge',
        available ? 'cursor-pointer' : '',
      ]"
      @click="onHeaderClick"
      @keypress="onHeaderClick"
    >
      <div class="flex-grow">
        <h3
          class="inline-block text-h3 lg:text-h2"
          :class="{ 'line-through': !available }"
        >
          {{ ticketOption.seatGroup.name }}
        </h3>
        <h3
          v-if="!available"
          class="inline-block ml-4 text-sta-rouge text-h3 uppercase"
        >
          Sold Out
        </h3>
        <span v-else-if="showCapacities"
          >({{ groupCapacityRemaining }} available)</span
        >
        <p v-if="expanded && ticketOption.seatGroup.description" class="py-2">
          {{ ticketOption.seatGroup.description }}
        </p>
      </div>
      <div v-if="available" class="flex items-center pr-4 text-3xl">
        <font-awesome-icon :icon="expanded ? 'chevron-up' : 'chevron-down'" />
      </div>
    </div>
    <div v-if="expanded" class="pb-2 bg-sta-gray">
      <div
        v-if="groupCapacityRemaining < 10"
        class="pt-2 px-2 text-center text-sta-rouge"
      >
        <template v-if="groupCapacityRemaining != 0">
          Hurry! Only {{ groupCapacityRemaining }} ticket{{
            groupCapacityRemaining > 1 ? 's' : null
          }}
          remaining in this location
        </template>
        <template v-else>No more tickets available at this location</template>
      </div>
      <concession-type
        v-for="(concessionTypeEdge, index) in orderedConcessionTypes"
        :key="index"
        :concession-type-edge="concessionTypeEdge"
        :current-tickets="currentLocationTickets"
        :max-add-allowed="groupCapacityRemaining"
        :can-add-tickets="canAddTickets"
        @add-ticket="
          $emit(
            'add-ticket',
            ticketOption.seatGroup,
            concessionTypeEdge.concessionType
          )
        "
        @set-tickets="
          (num) =>
            $emit(
              'set-tickets',
              ticketOption.seatGroup,
              concessionTypeEdge.concessionType,
              num
            )
        "
        @remove-ticket="
          $emit(
            'remove-ticket',
            ticketOption.seatGroup,
            concessionTypeEdge.concessionType
          )
        "
      />
      <div v-if="discounts.length" class="flex justify-center mb-4 mt-2 w-full">
        <group-ticket-button
          v-for="(discount, index) in discounts
            .filter(
              (discount) =>
                discount.requirements.length > 1 ||
                discount.requirements[0].number > 1
            )
            .filter(
              (discount) =>
                (!discount.seatGroup ||
                  discount.seatGroup.id == ticketOption.seatGroup.id) &&
                discount.requirements
                  .map((req) => req.number)
                  .reduce((a, b) => a + b, 0) <= groupCapacityRemaining
            )"
          :key="index"
          :discount="discount"
          class="inline-block mx-1"
          @add-discount-tickets="onAddDiscountTickets(discount)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ConcessionType from '@/components/booking/ConcessionType.vue'
import GroupTicketButton from '@/components/booking/GroupTicketButton.vue'
import lo from 'lodash'

export default {
  name: 'SeatGroup',
  components: { ConcessionType, GroupTicketButton },
  props: {
    expanded: {
      required: true,
      type: Boolean,
    },
    ticketOption: {
      required: true,
      type: Object,
    },
    groupCapacityRemaining: {
      required: true,
      type: Number,
    },
    currentTickets: {
      required: true,
      type: Array,
    },
    discounts: {
      required: true,
      type: Array,
    },
    showCapacities: {
      default: false,
      type: Boolean,
    },
    canAddTickets: {
      default: true,
      type: Boolean,
    },
  },
  computed: {
    orderedConcessionTypes() {
      return lo.sortBy(this.ticketOption.concessionTypes, 'price').reverse()
    },
    available() {
      return (
        this.groupCapacityRemaining !== 0 ||
        this.currentLocationTickets.length !== 0
      )
    },
    currentLocationTickets() {
      return this.currentTickets.filter((ticket) => {
        return ticket.matches(this.ticketOption.seatGroup)
      })
    },
  },
  methods: {
    onAddDiscountTickets(discount) {
      discount.requirements.forEach((requirement) => {
        this.$emit(
          'add-ticket',
          this.ticketOption.seatGroup,
          requirement.concessionType,
          requirement.number
        )
      })
    },
    onHeaderClick() {
      if (this.available) {
        this.$emit('select-location')
      }
    },
  },
}
</script>
