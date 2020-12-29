<template>
  <div class="space-y-1">
    <seat-location
      v-for="(seat_location, index) in seat_locations"
      :key="index"
      :seat_location="seat_location"
      :expanded="selected_location_index == index"
      :current_tickets="booking.tickets"
      :discounts="discounts"
      @select-location="
        selected_location_index =
          selected_location_index != index ? index : null
      "
      @add-ticket="onAddTicket"
      @set-tickets="onSetTicketNum"
      @remove-ticket="onRemoveTicket"
    />
    {{ booking.ticketCount() }} tickets (£ {{ booking.total_price_pounds }})
  </div>
</template>

<script>
import Booking from '@/classes/Booking';
import Ticket from '@/classes/Ticket';
import SeatLocation from '@/components/booking/SeatLocation.vue';
import { bookingService } from '@/services';

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
      discounts: null,
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
    bookingService
      .fetchGroupDiscountOptionsForPerformance(
        this.production.slug,
        this.booking.performance.id
      )
      .then((results) => {
        this.discounts = results;
      });
  },
  methods: {
    onAddTicket(location, concession_type, number = 1) {
      this.booking.addTicket(new Ticket(location, concession_type), number);
    },
    onSetTicketNum(location, concession_type, number) {
      this.booking.setTicketCount(location, concession_type, number);
    },
    onRemoveTicket(location, concession_type) {
      this.booking.removeTicket(location, concession_type);
    },
  },
};
</script>
