<template>
  <div class="text-white">
    <div class="p-2 mb-2 md:text-center bg-sta-gray-light">
      <p class="text-h3">Selected Performance:</p>
      <p class="text-sta-orange">
        {{ booking.performance.start | dateFormat('cccc d MMM') }}, Starting at
        {{ booking.performance.start | dateFormat('T') }}
      </p>
    </div>
    <div class="space-y-1" v-if="ticket_matrix">
      <seat-group
        v-for="(ticket_option, index) in ticket_matrix.ticket_options"
        :key="index"
        :ticket_option="ticket_option"
        :group_capacity_remaining="
          Math.min(
            ticket_matrix.capacityRemainingForSeatGroup(
              ticket_option.seat_group.id
            ),
            ticket_matrix.performance_capacity_remaining
          )
        "
        :expanded="
          selected_location_index == index ||
          ticket_matrix.ticket_options.length == 1
        "
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
    </div>
    <div v-if="booking.tickets.length" class="flex pt-2 my-4">
      <div
        class="px-4 pb-2 mx-auto text-center border-4 border-dashed rounded-md min-w-1/2 border-sta-gray"
      >
        <h2 class="text-h2">Selected Tickets</h2>
        <div class="overflow-auto">
          <table class="w-full text-left table-auto">
            <thead>
              <tr>
                <th class="p-2">Location</th>
                <th class="p-2">Type</th>
                <th class="w-24 p-2">Quantity</th>
                <th class="w-24 p-2">Line Total</th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="even:bg-sta-gray-light odd:bg-sta-gray"
                v-for="(ticket, index) in booking.ticket_overview(
                  ticket_matrix
                )"
                :key="index"
              >
                <td class="p-2">
                  {{ ticket.seat_group.name }}
                </td>
                <td class="p-2">{{ ticket.concession_type.name }}</td>
                <td class="p-2 text-center">{{ ticket.number }}</td>
                <td class="p-2 text-right">
                  £{{ (ticket.total_price / 100).toFixed(2) }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr v-if="booking.has_discounts && !booking.dirty">
                <td></td>
                <th class="p-2">Discounts</th>
                <td></td>
                <td class="p-2 text-right whitespace-nowrap">
                  -£{{ booking.discounts_value_pounds }}
                </td>
              </tr>
              <tr>
                <th></th>
                <th class="p-2">Subtotal</th>
                <td class="p-2 text-center">
                  {{ booking.tickets.length }}
                </td>
                <td class="p-2 text-right">
                  <template v-if="!booking.dirty"
                    >£{{ booking.sub_total_price_pounds }}</template
                  >
                  <font-awesome-icon
                    v-else
                    class="animate-spin"
                    icon="circle-notch"
                  />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
    <div v-if="booking.tickets.length" class="mt-2 text-center">
      <button
        class="font-semibold btn btn-orange"
        :disabled="booking.dirty"
        @click="$emit('next-stage')"
        @keypress="$emit('next-stage')"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
//TODO: Handle Errors
import lo from 'lodash';

import Booking from '@/classes/Booking';
import Ticket from '@/classes/Ticket';
import SeatGroup from '@/components/booking/SeatGroup.vue';
import { bookingService, performanceService } from '@/services';
import { runPromiseWithLoading } from '@/utils';

export default {
  name: 'ticket-selection-stage',
  components: { SeatGroup },
  props: {
    production: {
      required: true,
    },
    booking: {
      required: true,
      type: Booking,
    },
    ticket_matrix: {
      required: true,
    },
  },
  data() {
    return {
      expanded: true,
      selected_location_index: null,
      discounts: null,

      interaction_timer: lo.debounce(this.updateAPI, 2 * 1000),
    };
  },
  created() {
    runPromiseWithLoading(
      performanceService
        .fetchGroupDiscountOptionsForPerformance(
          this.production.slug,
          this.booking.performance.id
        )
        .then((results) => {
          this.discounts = results;
        })
    );
  },
  methods: {
    onAddTicket(location, concession_type, number = 1) {
      this.booking.addTicket(
        new Ticket(location.id, concession_type.id),
        this.ticket_matrix,
        number
      );
      this.interaction_timer();
    },
    onSetTicketNum(location, concession_type, number) {
      this.booking.setTicketCount(
        location,
        concession_type,
        number,
        this.ticket_matrix
      );
      this.interaction_timer();
    },
    onRemoveTicket(location, concession_type) {
      this.booking.removeTicket(location, concession_type, this.ticket_matrix);
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

      // Check for changes since API called
      if (this.booking.tickets.length == bookingResponse.tickets.length) {
        return this.booking.updateFromAPIData(bookingResponse);
      }
    },
  },
};
</script>
