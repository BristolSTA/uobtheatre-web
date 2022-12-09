<template>
  <div class="text-white">
    <div class="flex items-center p-2">
      <div class="pl-2 w-3/4">
        <p class="font-semibold">
          {{ concessionTypeEdge.concessionType.name }}
        </p>
        <p class="text-sm">
          {{ concessionTypeEdge.concessionType.description }}
        </p>
      </div>
      <div class="flex-col w-1/2 space-y-1 sm:w-1/4">
        <div class="font flex justify-center font-semibold">
          £{{ (concessionTypeEdge.price / 100).toFixed(2) }}
        </div>
        <div class="flex justify-center space-x-1">
          <button
            class="btn p-0 w-8 h-8"
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
            class="w-12 h-8 text-center text-black bg-white rounded-sm"
            @keypress.stop="
              if (!/^[0-9]$/i.test($event.key)) $event.preventDefault();
            "
            @input="
              (event) => {
                if (
                  isNaN(event.target.value) ||
                  event.target.value - numTickets > maxAddAllowed
                )
                  return;
                $emit('set-tickets', event.target.value);
              }
            "
          />
          <button
            class="btn p-0 w-8 h-8"
            :class="[
              maxAddAllowed < 1 || !canAddTickets
                ? 'btn-gray-light'
                : 'btn-orange'
            ]"
            :disabled="maxAddAllowed < 1 || !canAddTickets"
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
    concessionTypeEdge: {
      required: true,
      type: Object
    },
    currentTickets: {
      required: true,
      type: Array
    },
    maxAddAllowed: {
      required: true,
      type: Number
    },
    canAddTickets: {
      default: true,
      type: Boolean
    }
  },
  computed: {
    numTickets() {
      return this.currentTickets.filter((ticket) => {
        return ticket.matches(null, this.concessionTypeEdge.concessionType);
      }).length;
    }
  },
  methods: {
    addTicket() {
      this.$emit('add-ticket');
    },
    minusTicket() {
      this.$emit('remove-ticket');
    }
  }
};
</script>
