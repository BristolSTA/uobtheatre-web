<template>
  <div>
    <div
      class="pl-2 text-white cursor-pointer hover:bg-opacity-80"
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
      <ticket-type
        v-for="(concession_type, index) in seat_location.concession_types"
        :key="index"
        :concession_type="concession_type"
        :current_tickets="currentLocationTickets"
        @add-ticket="
          (concession_type) =>
            $emit('add-ticket', seat_location.seat_group, concession_type)
        "
        @remove-ticket="
          (concession_type) =>
            $emit('remove-ticket', seat_location.seat_group, concession_type)
        "
      />
    </div>
  </div>
</template>

<script>
import TicketType from '@/views/bookings/components/TicketType.vue';

export default {
  name: 'seat-location',
  components: { TicketType },
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
