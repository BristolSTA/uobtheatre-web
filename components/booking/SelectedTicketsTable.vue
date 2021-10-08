<template>
  <div
    class="
      mx-auto
      pb-2
      px-4
      min-w-1/2
      text-center
      border-4 border-dashed border-sta-gray
      rounded-md
    "
  >
    <h2 class="text-h2">Selected Tickets</h2>
    <div class="overflow-auto">
      <table class="table-auto w-full text-left">
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
            class="odd:bg-sta-gray even:bg-sta-gray-light"
          >
            <td class="p-2">
              {{ ticket.seatGroup.name }}
            </td>
            <td class="p-2">{{ ticket.concessionType.name }}</td>
            <td class="p-2 text-center">{{ ticket.number }}</td>
            <td v-if="showPrices" class="p-2 text-right font-mono">
              £{{ (ticket.totalPrice / 100).toFixed(2) }}
            </td>
          </tr>
        </tbody>
        <tfoot v-if="showPrices">
          <tr v-if="booking.hasDiscounts && !booking.dirty">
            <td></td>
            <th class="p-2">Discounts</th>
            <td></td>
            <td class="p-2 text-right whitespace-nowrap font-mono">
              -£{{ booking.discountsValuePounds }}
            </td>
          </tr>
          <tr>
            <th></th>
            <th class="p-2">Subtotal</th>
            <td class="p-2 text-center">
              {{ booking.tickets.length }}
            </td>
            <td class="p-2 text-right font-mono">
              <template v-if="!booking.dirty">
                £{{ booking.subTotalPricePounds }}
              </template>
              <loading-icon v-else ref="subtotalSpinner" size-class="" />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script>
import Booking from '@/classes/Booking'
import TicketMatrix from '@/classes/TicketsMatrix'
import LoadingIcon from '../ui/LoadingIcon.vue'

export default {
  components: { LoadingIcon },
  props: {
    booking: {
      required: true,
      type: Booking,
    },
    ticketMatrix: {
      type: TicketMatrix,
      default: null,
    },
    showPrices: {
      default: true,
      type: Boolean,
    },
  },
  data() {
    return {}
  },
}
</script>
