<template>
  <tr
    class="bg-sta-gray"
    :class="[index % 2 == 0 ? 'bg-sta-gray-light' : 'bg-sta-gray']"
  >
    <td colspan="100%" class="p-4">
      <div class="md:flex">
        <div class="flex-none order-2 md:pl-2">
          <button
            v-if="!editing"
            class="
              p-2
              bg-sta-green
              hover:bg-sta-green-dark
              rounded
              focus:outline-none
              transition-colors
            "
            @click="startEditing"
          >
            Alter Check Ins
          </button>
          <loading-icon v-else-if="saving" />
          <template v-else>
            <button
              class="
                p-2
                bg-sta-green
                hover:bg-sta-green-dark
                rounded
                focus:outline-none
                transition-colors
              "
              @click="updateBookingCheckins"
            >
              Save
            </button>
            <button
              class="
                p-2
                bg-gray-400
                roundedhover:bg-gray-500
                rounded
                focus:outline-none
                transition-colors
              "
              @click="cancelEdits"
            >
              Cancel
            </button>
          </template>
        </div>
        <!-- Mobile -->
        <div class="sm:hidden">
          <div v-for="(seatGroup, i) in seatGroupList" :key="i">
            <div class="mt-4 mb-2">
              <strong>Seat Group: </strong>{{ seatGroup.name }}
            </div>
            <table class="w-full text-sm sm:text-base">
              <tr class="text-left border-b">
                <th class="pr-3">Type</th>
                <th class="pr-3">Ticket ID</th>
                <th class="text-center">Checked In?</th>
              </tr>
              <tr
                v-for="(ticket, n) in sortedTicketList"
                :key="n"
                :class="{
                  'bg-sta-orange-dark': highlightTicketId === ticket.id,
                }"
              >
                <td class="pr-3">{{ ticket.concessionType.name }}</td>
                <td class="font-mono md:text-base text-xs sm:text-sm">
                  {{ ticket.id }}
                </td>
                <td class="py-1 text-center">
                  <ticket-check-in-btn
                    :editing="editing"
                    :ticket="ticket"
                    :editing-data="editingData"
                    @btn-press="
                      editingData[ticket.id] = !editingData[ticket.id]
                    "
                  />
                </td>
              </tr>
            </table>
          </div>
        </div>
        <!-- Not Mobile -->
        <div class="hidden sm:flex flex-grow order-1 overflow-x-auto">
          <table class="w-full">
            <tr class="text-left border-b">
              <th class="pr-4">Seat Group</th>
              <th class="pr-4">Type</th>
              <th class="pr-4">Ticket ID</th>
              <th class="text-center">Checked In?</th>
            </tr>
            <tr
              v-for="(ticket, n) in sortedTicketList"
              :key="n"
              :class="{ 'bg-sta-orange-dark': highlightTicketId === ticket.id }"
            >
              <td class="pr-4">
                <template v-if="n == 0">{{ ticket.seatGroup.name }}</template>
                <template
                  v-else-if="
                    sortedTicketList[n - 1].seatGroup.name !=
                    ticket.seatGroup.name
                  "
                  >{{ ticket.seatGroup.name }}</template
                >
              </td>
              <td class="pr-4">{{ ticket.concessionType.name }}</td>
              <td class="pr-4 font-mono text-sm md:text-base">
                {{ ticket.id }}
              </td>
              <td class="py-1 text-center">
                <ticket-check-in-btn
                  :editing="editing"
                  :ticket="ticket"
                  :editing-data="editingData"
                  @btn-press="editingData[ticket.id] = !editingData[ticket.id]"
                />
              </td>
            </tr>
          </table>
        </div>
      </div>
    </td>
  </tr>
</template>

<script>
import lo from 'lodash'
import Booking from '@/classes/Booking'

import CheckInMutation from '@/graphql/mutations/box-office/CheckInTickets.gql'
import UnCheckInMutation from '@/graphql/mutations/box-office/UnCheckInTickets.gql'
import BoxOfficePerformanceBooking from '@/graphql/queries/box-office/BoxOfficePerformanceBooking.gql'
import LoadingIcon from '../ui/LoadingIcon.vue'
import TicketCheckInBtn from './TicketCheckInBtn.vue'

export default {
  components: { LoadingIcon, TicketCheckInBtn },
  props: {
    booking: {
      required: true,
      type: Booking,
    },
    index: {
      required: true,
      type: Number,
    },
    highlightTicketId: {
      default: null,
      type: [String, Number],
    },
  },
  data() {
    return {
      editing: false,
      editingData: null,
      saving: false,
    }
  },
  computed: {
    sortedTicketList() {
      return lo.sortBy(this.booking.tickets, [
        (ticket) => ticket.seatGroup.id,
        (ticket) => ticket.concessionType.id,
      ])
    },
    seatGroupList() {
      return lo
        .uniqBy(this.booking.tickets, (ticket) => ticket.seatGroup.id)
        .map((ticket) => ticket.seatGroup)
    },
  },
  methods: {
    ticketsInSeatGroup(seatGroup) {
      return lo.sortBy(
        this.booking.tickets.filter(
          (ticket) => ticket.seatGroup.id === seatGroup.id
        ),
        (ticket) => ticket.concessionType.id
      )
    },
    startEditing() {
      this.editingData = lo.fromPairs(
        this.booking.tickets.map((ticket) => [ticket.id, ticket.checkedIn])
      )
      this.editing = true
    },
    async updateBookingCheckins() {
      this.saving = true
      const ticketsToCheckIn = this.booking.tickets
        .filter(
          (ticket) => !ticket.checkedIn && this.editingData[ticket.id] === true
        )
        .map((ticket) => {
          return { ticketId: ticket.id }
        })
      const ticketsToUnCheckIn = this.booking.tickets
        .filter((ticket) => this.editingData[ticket.id] === false)
        .map((ticket) => {
          return { ticketId: ticket.id }
        })

      const queries = []

      if (ticketsToCheckIn.length) {
        queries.push(
          this.$apollo.mutate({
            mutation: CheckInMutation,
            variables: {
              reference: this.booking.reference,
              performanceId: this.booking.performance.id,
              tickets: ticketsToCheckIn,
            },
          })
        )
      }

      if (ticketsToUnCheckIn.length) {
        queries.push(
          await this.$apollo.mutate({
            mutation: UnCheckInMutation,
            variables: {
              reference: this.booking.reference,
              performanceId: this.booking.performance.id,
              tickets: ticketsToUnCheckIn,
            },
          })
        )
      }

      await Promise.all(queries)

      const { data } = await this.$apollo.query({
        query: BoxOfficePerformanceBooking,
        variables: {
          performanceId: this.booking.performance.id,
          bookingId: this.booking.id,
        },
      })

      this.booking.updateFromAPIData(data.performance.bookings.edges[0].node)

      this.editing = this.saving = false
    },
    cancelEdits() {
      this.editing = false
    },
  },
}
</script>
