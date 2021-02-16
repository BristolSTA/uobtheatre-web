<template>
  <div class="text-white">
    <div class="flex items-center p-2">
      <div class="w-3/4 pl-2">
        <p class="font-semibold">
          {{ concession_type_edge.concessionType.name }}
        </p>
        <p class="text-sm">
          {{ concession_type_edge.concessionType.description }}
        </p>
      </div>
      <div class="flex-col w-1/2 space-y-1 sm:w-1/4">
        <div class="flex justify-center font-semibold font">
          £{{ (concession_type_edge.price / 100).toFixed(2) }}
        </div>
        <div class="flex justify-center space-x-1">
          <button
            class="w-8 h-8 p-0 btn btn-orange"
            :class="[!numTickets ? 'btn-gray-light' : 'btn-orange']"
            :disabled="!numTickets"
            @click="minusTicket"
            @keypress="minusTicket"
          >
            -
          </button>
          <input
            type="text"
            :value="numTickets"
            aria-label="number of tickets"
            class="w-8 h-8 text-center text-black bg-white rounded-sm"
            @keypress.stop="
              if (!/^[0-9]$/i.test($event.key)) $event.preventDefault();
            "
            @input="
              (event) => {
                if (
                  isNaN(event.target.value) ||
                  event.target.value - numTickets > max_add_allowed
                )
                  return;
                $emit('set-tickets', event.target.value);
              }
            "
          />
          <button
            class="w-8 h-8 p-0 btn"
            :class="[max_add_allowed < 1 ? 'btn-gray-light' : 'btn-orange']"
            :disabled="max_add_allowed < 1"
            @click="addTicket"
            @keypress="addTicket"
          >
            +
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConcessionType',
  props: {
    concession_type_edge: {
      required: true,
    },
    current_tickets: {
      required: true,
    },
    max_add_allowed: {
      required: true,
    },
  },
  computed: {
    numTickets() {
      return this.current_tickets.filter((ticket) => {
        return ticket.matches(null, this.concession_type_edge.concessionType);
      }).length;
    },
  },
  methods: {
    addTicket() {
      this.$emit('add-ticket');
    },
    minusTicket() {
      this.$emit('remove-ticket');
    },
  },
};
</script>
