<template>
  <div class="text-white">
    <div
      class="pl-2 cursor-pointer hover:bg-opacity-80"
      :class="[expanded ? 'bg-sta-orange' : 'bg-sta-green']"
      @click="$emit('select-location')"
      @keyup="$emit('select-location')"
    >
      <h1 class="text-h2">{{ seat_location.seat_group.name }}</h1>
      <div v-if="expanded" class="p-2">
        <p>{{ seat_location.seat_group.description }}</p>
      </div>
    </div>
    <div v-if="expanded">
      <concession-type
        v-for="(concession_type, index) in seat_location.concession_types"
        :key="index"
        :concession_type="concession_type"
        :current_tickets="currentLocationTickets"
        @add-ticket="
          $emit('add-ticket', seat_location.seat_group, concession_type)
        "
        @set-tickets="
          (num) =>
            $emit('set-tickets', seat_location.seat_group, concession_type, num)
        "
        @remove-ticket="
          $emit('remove-ticket', seat_location.seat_group, concession_type)
        "
      />
      <div v-if="discounts" class="flex justify-center w-full mt-2 mb-4">
        <group-ticket-button
          v-for="(discount, index) in discounts"
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
    seat_location: {
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
          this.seat_location.seat_group,
          requirement.concession_type,
          requirement.number
        );
      });
    },
  },
  computed: {
    currentLocationTickets() {
      return this.current_tickets.filter((ticket) => {
        return ticket.matches(this.seat_location.seat_group);
      });
    },
  },
};
</script>
