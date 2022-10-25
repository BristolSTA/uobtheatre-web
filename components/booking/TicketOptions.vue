<template>
  <div class="space-y-1">
    <p v-if="maxTickets" class="text-center">
      You can book a maximum of {{ maxTickets }} tickets per booking
    </p>
    <seat-group
      v-for="(ticketOption, index) in ticketMatrix.ticketOptions"
      :key="index"
      class="sm:bg-sta-gray"
      :ticket-option="ticketOption"
      :group-capacity-remaining="
        ticketMatrix.capacityRemainingForSeatGroup(ticketOption.seatGroup.id)
      "
      :expanded="
        selected_location_index == index ||
        ticketMatrix.ticketOptions.length == 1
      "
      :current-tickets="booking.tickets"
      :discounts="ticketMatrix.discounts.edges.map((edge) => edge.node)"
      :show-capacities="showCapacities"
      :can-add-tickets="
        maxTickets !== null ? booking.tickets.length < maxTickets : true
      "
      @select-location="
        selected_location_index =
          selected_location_index != index ? index : null
      "
      @add-ticket="onAddTicket"
      @set-tickets="onSetTicketNum"
      @remove-ticket="onRemoveTicket"
    />
  </div>
</template>

<script>
import lo from "lodash";

import Booking from "@/classes/Booking";
import Ticket from "@/classes/Ticket";
import TicketMatrix from "@/classes/TicketsMatrix";
import SeatGroup from "@/components/booking/SeatGroup.vue";

export default {
  components: { SeatGroup },
  props: {
    booking: {
      required: true,
      type: Booking,
    },
    ticketMatrix: {
      type: TicketMatrix,
      default: null,
    },
    showCapacities: {
      default: false,
      type: Boolean,
    },
    maxTickets: {
      default: null,
      type: Number,
    },
  },
  data() {
    return {
      expanded: true,
      selected_location_index: null,

      interaction_timer: lo.debounce(this.requestUpdate, 2 * 1000),
    };
  },
  methods: {
    onAddTicket(seatGroup, concessionType, number = 1) {
      this.booking.addTicket(
        new Ticket(seatGroup.id, concessionType.id),
        this.ticketMatrix,
        number
      );
      this.interaction_timer();
    },
    onSetTicketNum(seatGroup, concessionType, number) {
      this.booking.setTicketCount(
        seatGroup,
        concessionType,
        number,
        this.ticketMatrix
      );
      this.interaction_timer();
    },
    onRemoveTicket(seatGroup, concessionType) {
      this.booking.removeTicket(seatGroup, concessionType, this.ticketMatrix);
      this.interaction_timer();
    },
    requestUpdate() {
      this.$emit("request-update");
    },
  },
};
</script>
