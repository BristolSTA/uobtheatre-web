<template>
  <div v-if="booking.performance" class="text-white">
    <div class="p-2 mb-2 md:text-center bg-sta-gray-light">
      <p class="text-h3">Selected Performance:</p>
      <p class="text-sta-orange">
        {{ booking.performance.start | dateFormat('cccc d MMM') }}, Starting at
        {{ booking.performance.start | dateFormat('T') }}
      </p>
    </div>
    <div v-if="ticketMatrix" class="space-y-1">
      <seat-group
        v-for="(ticketOption, index) in ticketMatrix.ticketOptions"
        :key="index"
        :ticket-option="ticketOption"
        :group-capacity-remaining="
          ticketMatrix.capacityRemainingForSeatGroup(ticketOption.seatGroup.id)
        "
        :expanded="
          selected_location_index == index ||
          ticketMatrix.ticketOptions.length == 1
        "
        :current-tickets="booking.tickets"
        :discounts="ticketMatrix.discounts"
        @select-location="
          selected_location_index =
            selected_location_index != index ? index : null
        "
        @add-ticket="onAddTicket"
        @set-tickets="onSetTicketNum"
        @remove-ticket="onRemoveTicket"
      />
    </div>
    <all-errors-display
      :errors="errors"
      class="p-2 text-center bg-sta-gray-dark"
    />
    <div v-if="booking.tickets.length" class="flex my-4">
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
                  <font-awesome-icon
                    v-else
                    ref="subtotalSpinner"
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
import gql from 'graphql-tag'
import lo from 'lodash'

import Booking from '@/classes/Booking'
import Ticket from '@/classes/Ticket'
import TicketMatrix from '@/classes/TicketsMatrix'
import SeatGroup from '@/components/booking/SeatGroup.vue'
import AllErrorsDisplay from '@/components/ui/AllErrorsDisplay.vue'
import PriceBreakdownFragment from '@/graphql/fragments/booking/AllPriceBreakdown.gql'
import DetailBookingFragment from '@/graphql/fragments/booking/DetailedBookingDetails.gql'
import ErrorsPartial from '@/graphql/partials/ErrorsPartial'
import { performMutation } from '@/utils'

import BookingStage from '@/classes/BookingStage'
export default {
  stageInfo: new BookingStage({
    name: 'Ticket Selection',
    routeName: 'production-slug-book-performanceId-tickets',
  }),
  components: { SeatGroup, AllErrorsDisplay },
  props: {
    production: {
      required: true,
      type: Object,
    },
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
    return {
      expanded: true,
      selected_location_index: null,

      interaction_timer: lo.debounce(this.updateAPI, 2 * 1000),
      errors: null,
    }
  },
  methods: {
    onAddTicket(seatGroup, concessionType, number = 1) {
      this.booking.addTicket(
        new Ticket(seatGroup.id, concessionType.id),
        this.ticketMatrix,
        number
      )
      this.interaction_timer()
    },
    onSetTicketNum(seatGroup, concessionType, number) {
      this.booking.setTicketCount(
        seatGroup,
        concessionType,
        number,
        this.ticketMatrix
      )
      this.interaction_timer()
    },
    onRemoveTicket(seatGroup, concessionType) {
      this.booking.removeTicket(seatGroup, concessionType, this.ticketMatrix)
      this.interaction_timer()
    },
    async updateAPI() {
      const queryBody = `
        ${ErrorsPartial}
        booking {
          ...DetailedBookingDetails
        }`

      const variables = {
        id: this.booking.id,
        performanceID: this.booking.performance.id,
        tickets: this.booking.toAPIData().tickets,
      }

      let bookingResponse
      try {
        if (!this.booking.id) {
          // We haven't got a booking yet, lets create one
          const data = await performMutation(
            this.$apollo,
            {
              mutation: gql`
            mutation($performanceID: IdInputField!, $tickets: [CreateTicketInput]) {
              createBooking(performanceId: $performanceID, tickets: $tickets) {
                ${queryBody}
              }
            }
            ${PriceBreakdownFragment}
            ${DetailBookingFragment}
          `,
              variables,
            },
            'createBooking'
          )
          bookingResponse = data.createBooking.booking
        } else {
          // We have a booking, lets update it
          const data = await performMutation(
            this.$apollo,
            {
              mutation: gql`
            mutation($id: IdInputField!, $tickets: [UpdateTicketInput]) {
              updateBooking(bookingId: $id, tickets: $tickets) {
                ${queryBody}
              }
            }
            ${PriceBreakdownFragment}
            ${DetailBookingFragment}
          `,
              variables,
            },
            'updateBooking'
          )
          bookingResponse = data.updateBooking.booking
        }
      } catch ({ errors }) {
        this.errors = errors
        return
      }

      // Check for changes since API called.
      if (this.booking.tickets.length === bookingResponse.tickets.length) {
        return this.booking.updateFromAPIData(bookingResponse)
      }

      // There has been a change in the selected tickets whilst calling the API. Let's trigger another call...
      this.interaction_timer()
    },
  },
}
</script>
