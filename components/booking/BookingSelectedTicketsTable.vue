<template>
  <div class="overflow-auto">
    <table class="table-auto w-full text-left" :class="tableClass">
      <thead>
        <tr>
          <th class="p-2">Location</th>
          <th class="p-2">Type</th>
          <th class="hidden p-2 w-24 sm:table-cell">Quantity</th>
          <th class="p-2 w-24 text-center sm:hidden">Qty</th>
          <th v-if="showPrices" class="p-2 w-24">Line Total</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(ticket, index) in booking.ticketOverview(ticketMatrix)"
          :key="index"
          :class="rowClass"
        >
          <td class="p-2">
            {{ ticket.seatGroup.name }}
          </td>
          <td class="p-2">
            {{ ticket.concessionType.name }}
          </td>
          <td class="p-2 text-center">
            {{ ticket.number }}
          </td>
          <td v-if="showPrices" class="p-2 text-right font-mono">
            £{{ (ticket.totalPrice / 100).toFixed(2) }}
          </td>
        </tr>
      </tbody>
      <tfoot v-if="showPrices">
        <tr v-if="booking.hasDiscounts && !booking.dirty">
          <td />
          <th class="p-2">Discounts</th>
          <td />
          <td class="p-2 text-right whitespace-nowrap font-mono">
            -£{{ booking.discountsValuePounds }}
          </td>
        </tr>
        <tr>
          <th />
          <th class="p-2">Subtotal</th>
          <td class="p-2 text-center">
            {{ booking.tickets.length }}
          </td>
          <td class="p-2 text-right font-mono whitespace-nowrap">
            £{{ booking.subTotalPricePounds }}
            <loading-icon
              v-if="booking.dirty"
              ref="subtotalSpinner"
              size-class=""
            />
          </td>
        </tr>
        <tr v-if="showTotal">
          <th />
          <th class="p-2">Total</th>
          <th />
          <td class="p-2 text-right font-mono whitespace-nowrap">
            £{{ booking.totalPricePounds }}
            <loading-icon
              v-if="booking.dirty"
              ref="subtotalSpinner"
              size-class=""
            />
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import LoadingIcon from '../ui/UiLoadingIcon.vue';
import Booking from '~~/classes/Booking';
import TicketMatrix from '~~/classes/TicketsMatrix';

export default {
  components: { LoadingIcon },
  props: {
    booking: {
      required: true,
      type: Booking
    },
    ticketMatrix: {
      type: TicketMatrix,
      default: null
    },
    showPrices: {
      default: true,
      type: Boolean
    },
    showTotal: {
      default: false,
      type: Boolean
    },
    rowClass: {
      default: 'odd:bg-sta-gray even:bg-sta-gray-light',
      type: String
    },
    tableClass: {
      default: '',
      type: String
    }
  }
};
</script>
