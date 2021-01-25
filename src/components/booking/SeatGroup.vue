<template>
  <div class="text-white">
    <div
      ref="header"
      class="flex py-2 pl-4 cursor-pointer hover:bg-opacity-80"
      :class="[expanded ? 'bg-sta-orange' : 'bg-sta-green']"
      @click="$emit('select-location')"
      @keypress="$emit('select-location')"
    >
      <div class="flex-grow">
        <h1 class="text-h3 lg:text-h2">
          {{ ticket_option.seat_group.name }}
        </h1>
        <p v-if="expanded && ticket_option.seat_group.description" class="p-2">
          {{ ticket_option.seat_group.description }}
        </p>
      </div>
      <div class="flex items-center pr-4 text-3xl">
        <font-awesome-icon :icon="expanded ? 'chevron-up' : 'chevron-down'" />
      </div>
    </div>
    <div v-if="expanded" class="border-4 border-t-0 border-sta-gray">
      <div
        v-if="group_capacity_remaining <= 10"
        class="flex justify-center pt-4 font-semibold text-sta-rouge"
        ref="ticket-warning"
      >
        <template v-if="group_capacity_remaining == 0">
          No More Tickets Remaining
        </template>
        <template v-else-if="group_capacity_remaining == 1">
          Hurry, Only {{ group_capacity_remaining }} ticket remaining!
        </template>
        <template v-else>
          Hurry, Only {{ group_capacity_remaining }} tickets remaining!
        </template>
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
            (discount) => !discount.seat_group
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
  },
  computed: {
    currentLocationTickets() {
      return this.current_tickets.filter((ticket) => {
        return ticket.matches(this.ticket_option.seat_group);
      });
    },
  },
};
</script>
