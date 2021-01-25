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
          {{ ticket_option.seat_group.name }}
        </h3>
        <h3
          v-if="!available"
          class="inline-block ml-4 uppercase text-h3 text-sta-rouge"
        >
          Sold Out
        </h3>
        <p v-if="expanded && ticket_option.seat_group.description" class="p-2">
          {{ ticket_option.seat_group.description }}
        </p>
      </div>
      <div v-if="available" class="flex items-center pr-4 text-3xl">
        <font-awesome-icon :icon="expanded ? 'chevron-up' : 'chevron-down'" />
      </div>
    </div>
    <div v-if="expanded" class="pb-2 bg-sta-gray">
      <div
        class="px-2 pt-2 text-center text-sta-rouge"
        v-if="group_capacity_remaining < 10"
      >
        <template v-if="group_capacity_remaining != 0">
          Hurry! Only {{ group_capacity_remaining }} ticket{{
            group_capacity_remaining > 1 ? 's' : null
          }}
          remaining in this location</template
        >
        <template v-else>No more tickets available at this location</template>
      </div>
      <concession-type
        v-for="(concession_type, index) in ticket_option.concession_types"
        :key="index"
        :concession_type="concession_type"
        :current_tickets="currentLocationTickets"
        :max_add_allowed="group_capacity_remaining"
        @add-ticket="
          $emit('add-ticket', ticket_option.seat_group, concession_type)
        "
        @set-tickets="
          (num) =>
            $emit('set-tickets', ticket_option.seat_group, concession_type, num)
        "
        @remove-ticket="
          $emit('remove-ticket', ticket_option.seat_group, concession_type)
        "
      />
      <div v-if="discounts" class="flex justify-center w-full mt-2 mb-4">
        <group-ticket-button
          v-for="(discount, index) in discounts.filter(
            (discount) =>
              !discount.seat_group &&
              discount.discount_requirements
                .map((req) => req.number)
                .reduce((a, b) => a + b, 0) <= group_capacity_remaining
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
import ConcessionType from '@/components/booking/ConcessionType.vue';
import GroupTicketButton from '@/components/booking/GroupTicketButton.vue';

export default {
  name: 'seat-location',
  components: { ConcessionType, GroupTicketButton },
  props: {
    expanded: {
      required: true,
    },
    ticket_option: {
      required: true,
    },
    group_capacity_remaining: {
      required: true,
    },
    current_tickets: {
      required: true,
    },
    discounts: {
      required: true,
    },
  },
  methods: {
    onAddDiscountTickets(discount) {
      discount.discount_requirements.forEach((requirement) => {
        this.$emit(
          'add-ticket',
          this.ticket_option.seat_group,
          requirement.concession_type,
          requirement.number
        );
      });
    },
    onHeaderClick() {
      if (this.available) {
        this.$emit('select-location');
      }
    },
  },
  computed: {
    available() {
      return (
        this.group_capacity_remaining != 0 ||
        this.currentLocationTickets.length != 0
      );
    },
    currentLocationTickets() {
      return this.current_tickets.filter((ticket) => {
        return ticket.matches(this.ticket_option.seat_group);
      });
    },
  },
};
</script>
