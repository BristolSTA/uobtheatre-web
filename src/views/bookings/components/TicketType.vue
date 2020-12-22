<template>
  <div class="text-white bg-sta-gray-dark">
    <div class="flex items-center p-2">
      <div class="w-3/4 pl-2">{{ ticket_type.name }}</div>
      <div class="flex-col w-1/4 space-y-1">
        <div class="flex justify-center font-semibold font">
          £{{ ticket_type.price_pounds }}
        </div>
        <div class="flex justify-center space-x-1">
          <button
            class="w-8 h-8 p-0 btn btn-orange"
            @click="minusTicket"
            @keyup="minusTicket"
            :class="[!num_tickets ? 'btn-gray-light' : 'btn-orange']"
            :disabled="!num_tickets"
          >
            -
          </button>
          <div
            class="flex items-center justify-center w-8 h-8 text-black bg-white rounded-sm"
          >
            {{ num_tickets }}
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
    ticket_type: {
      required: true,
    },
  },
  data() {
    return {
      num_tickets: 0,
    };
  },
  methods: {
    addTicket() {
      ++this.num_tickets;
    },
    minusTicket() {
      --this.num_tickets;
    },
  },
};
</script>
