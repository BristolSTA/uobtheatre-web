<template>
  <div class="text-white bg-sta-gray-dark">
    <div class="flex items-center p-2">
      <div class="w-3/4 pl-2">
        <p class="font-semibold">{{ concession_type.name }}</p>
        <p class="text-sm">{{ concession_type.description }}</p>
      </div>
      <div class="flex-col w-1/4 space-y-1">
        <div class="flex justify-center font-semibold font">
          £{{ concession_type.price_pounds }}
        </div>
        <div class="flex justify-center space-x-1">
          <button
            class="w-8 h-8 p-0 btn btn-orange"
            @click="minusTicket"
            @keyup="minusTicket"
            :class="[!numTickets ? 'btn-gray-light' : 'btn-orange']"
            :disabled="!numTickets"
          >
            -
          </button>
          <div
            class="flex items-center justify-center w-8 h-8 text-black bg-white rounded-sm"
          >
            {{ numTickets }}
          </div>
          <button
            class="w-8 h-8 p-0 btn btn-orange"
            @click="addTicket"
            @keyup="addTicket"
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
  name: 'ticket-type',
  props: {
    concession_type: {
      required: true,
    },
    current_tickets: {
      required: true,
    },
  },
  methods: {
    addTicket() {
      this.$emit('add-ticket', this.concession_type);
    },
    minusTicket() {
      this.$emit('remove-ticket', this.concession_type);
    },
  },
  computed: {
    numTickets() {
      return this.current_tickets.filter((ticket) => {
        return ticket.matches(null, this.concession_type);
      }).length;
    },
  },
};
</script>
