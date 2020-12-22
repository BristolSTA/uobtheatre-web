<template>
  <div>
    <div
      class="pl-2 text-white"
      :class="[expanded ? 'bg-sta-orange' : 'bg-sta-green']"
      @click="$emit('select-location', true)"
      @keyup="$emit('select-location', true)"
    >
      <h1 class="text-h2">{{ location.name }}</h1>
      <div v-if="expanded" class="p-2">
        <p>Description</p>
      </div>
    </div>
    <div v-if="expanded">
      <ticket-type
        v-for="(ticket_type, index) in location.ticket_types"
        :key="index"
        :ticket_type="ticket_type"
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
    location: {
      required: true,
    },
  },
  data() {
    return {};
  },
};
</script>
