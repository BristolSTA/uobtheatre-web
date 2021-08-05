<template>
  <div
    class="
      px-4
      pb-2
      mx-auto
      text-center
      border-4 border-dashed
      rounded-md
      min-w-1/2
      border-sta-gray
    "
  >
    <h2 class="text-h2">Selected Tickets</h2>
    <div class="overflow-auto">
      <table class="w-full text-left table-auto">
        <thead>
          <tr>
            <th class="p-2">Location</th>
            <th class="p-2">Type</th>
            <th class="hidden w-24 p-2 sm:table-cell">Quantity</th>
            <th class="w-24 p-2 text-center sm:hidden">Qty</th>
            <th class="w-24 p-2">Line Total</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(ticket, index) in booking.ticketOverview(ticketMatrix)"
            :key="index"
            class="even:bg-sta-gray-light odd:bg-sta-gray"
          >
            <td class="p-2">
              {{ ticket.seatGroup.name }}
            </td>
            <td class="p-2">{{ ticket.concessionType.name }}</td>
            <td class="p-2 text-center">{{ ticket.number }}</td>
            <td class="p-2 font-mono text-right">
              £{{ (ticket.totalPrice / 100).toFixed(2) }}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr v-if="booking.hasDiscounts && !booking.dirty">
            <td></td>
            <th class="p-2">Discounts</th>
            <td></td>
            <td class="p-2 font-mono text-right whitespace-nowrap">
              -£{{ booking.discountsValuePounds }}
            </td>
          </tr>
          <tr>
            <th></th>
            <th class="p-2">Subtotal</th>
            <td class="p-2 text-center">
              {{ booking.tickets.length }}
            </td>
            <td class="p-2 font-mono text-right">
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
  },
  data() {
    return {}
  },
}
</script>
