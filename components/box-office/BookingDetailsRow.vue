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
            class="p-2 transition-colors rounded bg-sta-green hover:bg-sta-green-dark focus:outline-none"
            @click="startEditing"
          >
            Alter Check Ins
          </button>
          <template v-else>
            <button
              class="p-2 transition-colors rounded bg-sta-green hover:bg-sta-green-dark focus:outline-none"
              @click="updateBookingCheckins"
            >
              Save
            </button>
            <button
              class="p-2 transition-colors bg-gray-400 rounded hover:bg-gray-500 focus:outline-none"
              @click="cancelEdits"
            >
              Cancel
            </button>
          </template>
        </div>
        <div class="flex-grow order-1 overflow-x-auto">
          <table class="w-full">
            <tr class="text-left border-b">
              <th class="pr-4">Seat Group</th>
              <th class="pr-4">Type</th>
              <th class="pr-4">Ticket ID</th>
              <th class="text-center">Checked In?</th>
            </tr>
            <tr v-for="(ticket, n) in sortedTicketList" :key="n">
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
              <td class="pr-4 font-mono">{{ ticket.id }}</td>
              <td class="pt-1 text-center">
                <div class="flex items-center justify-center space-x-2">
                  <font-awesome-icon
                    :icon="
                      (editing ? editingData[ticket.id] : ticket.checkedIn)
                        ? 'check-circle'
                        : 'times-circle'
                    "
                    :class="[
                      (editing ? editingData[ticket.id] : ticket.checkedIn)
                        ? 'text-sta-green'
                        : 'text-sta-rouge',
                    ]"
                  />
                  <button
                    v-if="editing"
                    class="flex-none p-1 transition-colors rounded bg-sta-orange hover:bg-sta-orange-dark focus:outline-none"
                    @click="editingData[ticket.id] = !editingData[ticket.id]"
                  >
                    {{ editingData[ticket.id] ? 'Un-Check In' : 'Check In' }}
                  </button>
                </div>
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

export default {
  props: {
    booking: {
      required: true,
      type: Booking,
    },
    expanded: {
      required: true,
      type: Boolean,
    },
    index: {
      required: true,
      type: Number,
    },
  },
  data() {
    return {
      editing: false,
      editingData: null,
    }
  },
  computed: {
    sortedTicketList() {
      return lo.sortBy(this.booking.tickets, [
        (ticket) => ticket.seatGroup.id,
        (ticket) => ticket.concessionType.id,
      ])
    },
  },
  methods: {
    startEditing() {
      this.editingData = lo.fromPairs(
        this.booking.tickets.map((ticket) => [ticket.id, ticket.checkedIn])
      )
      this.editing = true
    },
    updateBookingCheckins() {
      // TODO: Implmenet update call to API
      this.editing = false
    },
    cancelEdits() {
      this.editing = false
    },
  },
}
</script>
