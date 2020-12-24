<template>
  <div class="space-y-1">
    <seat-location
      v-for="(seat_location, index) in seat_locations"
      :key="index"
      :seat_location="seat_location"
      :expanded="selected_location_index == index"
      :current_tickets="booking.tickets"
      @select-location="selected_location_index = index"
      @add-ticket="onAddTicket"
      @remove-ticket="onRemoveTicket"
    />
    {{ booking.tickets.length }} tickets (£ {{ booking.total_pounds }})
  </div>
</template>

<script>
import Booking from '@/classes/Booking';
import Ticket from '@/classes/Ticket';
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
      type: Booking,
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
  methods: {
    onAddTicket(location, concession_type) {
      this.booking.addTicket(new Ticket(location, concession_type));
    },
    onRemoveTicket(location, concession_type) {
      // Find a SINGLE matching ticket (we don't want to remove all of them!)
      let ticketIndex = this.booking.tickets.findIndex((ticket) => {
        return ticket.matches(location, concession_type);
      });
      if (ticketIndex < 0) return;

      this.booking.removeTicketByIndex(ticketIndex);
    },
  },
};
</script>
