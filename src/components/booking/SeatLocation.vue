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
      <ticket-type
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
      <div class="inline-block px-4 py-2 text-center rounded-sm bg-sta-green">
        <span class="font-semibold">Family Ticket:</span>
        <div class="flex justify-center text-sm">
          <table class="text-left table-auto">
            <tr>
              <td class="pr-2">Adult</td>
              <td>x 2</td>
            </tr>
            <tr>
              <td class="pr-2">Studentttttttt</td>
              <td>x 10</td>
            </tr>
          </table>
        </div>
        <button
          class="font-semibold text-sm btn w-full mt-1 px-2.5 py-1 rounded-sm btn-orange"
        >
          Add Tickets
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import TicketType from '@/components/booking/TicketType.vue';

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
