<template>
  <div class="p-2 bg-sta-green">
    <div class="flex space-x-6 justify-evenly">
      <font-awesome-icon icon="check" class="my-auto fa-4x" />
      <div>
        <h3 class="text-lg font-semibold">Ticket Checked In</h3>
        <p>ID: {{ ticket.id }}</p>
        <p>Type: {{ ticket.concessionType.name }}</p>
        <p>Location: {{ ticket.seatGroup.name }}</p>
      </div>
      <div class="px-2 py-1 bg-sta-green-dark">
        <div class="flex justify-between mb-2">
          <h3 class="text-lg font-semibold">Booking Information</h3>
          <button
            class="block px-2 py-1 transition-colors bg-sta-orange hover:bg-sta-orange-dark"
          >
            View / Check-in Booking
          </button>
        </div>
        <div class="flex space-x-4">
          <div>
            <p>Reference: {{ booking.reference }}</p>
            <p>
              User: {{ booking.user.firstName }} {{ booking.user.lastName }}
            </p>
            <p>
              <strong>{{ booking.tickets.length }} tickets</strong>
            </p>
          </div>
          <table>
            <tr
              v-for="(ticketGroup, index) in booking.priceBreakdown.tickets"
              :key="index"
              class="border"
            >
              <td class="px-1 pb-1">{{ ticketGroup.number }} x</td>
              <td class="px-1 pb-1">{{ ticketGroup.concessionType.name }},</td>
              <td class="px-1 pb-1">{{ ticketGroup.seatGroup.name }}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    alreadyCheckedIn: {
      type: Boolean,
      default: false,
    },
    invalid: {
      type: Boolean,
      default: false,
    },
    ticket: {
      type: Object,
      required: true,
    },
    booking: {
      type: Object,
      required: true,
    },
  },
}
</script>
