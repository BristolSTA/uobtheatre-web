<template>
  <overview-box>
    <template v-slot:title>
      <font-awesome-icon icon="theater-masks" class="mr-2" />
      {{ booking.performance.production.name }}
    </template>
    <template v-slot:subtitle>
      <p class="text-h3">
        {{ booking.performance.start | dateFormat('EEEE d MMMM kkkk') }}
      </p>
    </template>
    <div>
      <p class="py-1 text-h4">Booking Ref : {{ booking.bookingReference }}</p>
      View Tickets Button
    </div>
  </overview-box>
</template>

<script>
import Booking from '@/classes/Booking';

import OverviewBox from './OverviewBox.vue';
export default {
  name: 'BookingSumamryOverview',
  components: { OverviewBox },
  props: {
    booking: {
      required: true,
      type: Booking,
    },
  },
};
</script>
