<template>
  <div class="text-white">
    <div
      ref="header"
      class="flex py-2 pl-4 hover:bg-opacity-80"
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
          class="inline-block ml-4 uppercase text-h3 text-sta-rouge"
        >
          Sold Out
        </h3>
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
        class="px-2 pt-2 text-center text-sta-rouge"
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
        v-for="(concessionTypeEdge, index) in ticketOption.concessionTypes"
        :key="index"
        :concession-type-edge="concessionTypeEdge"
        :current-tickets="currentLocationTickets"
        :max-add-allowed="groupCapacityRemaining"
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
      <div v-if="discounts" class="flex justify-center w-full mt-2 mb-4">
        <group-ticket-button
          v-for="(discount, index) in discounts.filter(
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

export default {
  name: 'SeatLocation',
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
  },
  computed: {
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
