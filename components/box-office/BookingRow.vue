<template>
  <div class="text-white">
    <div
      ref="header"
      class="flex px-4 py-2 cursor-pointer hover:bg-opacity-80"
      :class="[
        expanded
          ? 'bg-sta-orange'
          : index % 2 == 0
          ? 'bg-sta-gray-light'
          : 'bg-sta-gray',
      ]"
      @click="$emit('select-booking')"
      @keypress="$emit('select-booking')"
    >
      <div class="flex w-full">
        <div class="flex-grow">James Jelgar</div>
        <div class="px-2 font-mono w-36">{{ booking.reference }}</div>
        <div class="w-20 px-1 text-center md:w-40 xl:w-52 2xl:w-72">
          <font-awesome-icon icon="check-square" />
        </div>
        <div class="w-20 font-mono text-right">
          £{{ (booking.priceBreakdown.totalPrice / 100).toFixed(2) }}
        </div>
      </div>
    </div>
    <div
      v-if="expanded"
      class="p-4 bg-sta-gray"
      :class="[index % 2 == 0 ? 'bg-sta-gray-light' : 'bg-sta-gray']"
    >
      <div>
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
            <td class="text-center">
              <font-awesome-icon icon="check-square" />
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import lo from 'lodash'
import Booking from '@/classes/Booking'

export default {
  name: 'SeatLocation',
  components: {},
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
    return {}
  },
  computed: {
    sortedTicketList() {
      return lo.sortBy(this.booking.tickets, [
        (ticket) => ticket.seatGroup.id,
        (ticket) => ticket.concessionType.id,
      ])
    },
  },
  methods: {},
}
</script>
