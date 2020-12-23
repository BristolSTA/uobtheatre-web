<template>
  <div class="space-y-1">
    <seat-location
      v-for="(seat_location, index) in seat_locations"
      :key="index"
      :seat_location="seat_location"
      :expanded="selected_location_index == index"
      @select-location="selected_location_index = index"
    />
  </div>
</template>

<script>
import { bookingService } from '@/services';
import SeatLocation from '@/views/bookings/components/SeatLocation.vue';

export default {
  name: 'ticket-selection-stage',
  components: { SeatLocation },
  props: {
    production: {
      required: true,
    },
    booking: {
      required: true,
    },
  },
  data() {
    return {
      expanded: true,
      selected_location_index: null,
      seat_locations: null,
    };
  },
  created() {
    bookingService
      .fetchTicketOptionsForPerformance(
        this.production.slug,
        this.booking.performance.id
      )
      .then((results) => {
        this.seat_locations = results;
      });
  },
  methods: {},
};
</script>
