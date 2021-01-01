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
//TODO: Handle Errors
import lo from 'lodash';

import Booking from '@/classes/Booking';
import Ticket from '@/classes/Ticket';
import SeatLocation from '@/components/booking/SeatLocation.vue';
import { bookingService, performanceService } from '@/services';

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

      interaction_timer: lo.debounce(this.updateAPI, 2 * 1000),
    };
  },
  created() {
    performanceService
      .fetchTicketOptionsForPerformance(
        this.production.slug,
        this.booking.performance.id
      )
      .then((results) => {
        this.seat_locations = results;
      });
    performanceService
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
      this.booking.addTicket(
        new Ticket(location.id, concession_type.id),
        number
      );
      this.interaction_timer();
    },
    onSetTicketNum(location, concession_type, number) {
      this.booking.setTicketCount(location, concession_type, number);
      this.interaction_timer();
    },
    onRemoveTicket(location, concession_type) {
      this.booking.removeTicket(location, concession_type);
      this.interaction_timer();
    },
    async updateAPI() {
      let bookingResponse;
      if (!this.booking.id) {
        // We haven't got a booking yet, lets create one
        bookingResponse = await bookingService.startNewBooking(
          this.booking.performance.id,
          this.booking.toAPIData().tickets
        );
      } else {
        // We have a booking, lets update it
        bookingResponse = await bookingService.updateBooking(
          this.booking.id,
          this.booking.toAPIData().tickets
        );
      }
      this.booking.updateFromAPIData(bookingResponse);
    },
  },
};
</script>
