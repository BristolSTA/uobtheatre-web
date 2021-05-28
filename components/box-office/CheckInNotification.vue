<template>
  <div
    class="relative p-2"
    :class="[errors ? 'bg-sta-orange' : 'bg-sta-green']"
  >
    <div class="absolute top-0 right-0 m-6 md:m-0 md:mr-2">
      <font-awesome-icon
        icon="times"
        class="cursor-pointer fa-2x"
        @click="$emit('close')"
      />
    </div>
    <div
      class="flex flex-col text-center md:space-x-6 md:flex-row justify-evenly md:text-left"
    >
      <div class="w-full text-center md:w-16">
        <font-awesome-icon
          :icon="errors ? 'exclamation' : 'check'"
          class="my-auto fa-4x"
        />
      </div>
      <div class="flex-grow">
        <div class="flex flex-col justify-between mr-10 space-x-6 md:flex-row">
          <div v-if="errors">
            <strong>There was an issue with this ticket</strong>
            <p v-for="(error, index) in errors" :key="index">
              {{ error.message }}
            </p>
          </div>
          <div v-if="ticket">
            <h3 class="text-lg font-semibold">
              {{ errors ? 'Ticket Information' : 'Ticket Checked In' }}
            </h3>
            <p>ID: {{ ticket.id }}</p>
            <p>Type: {{ ticket.concessionType.name }}</p>
            <p>Location: {{ ticket.seatGroup.name }}</p>
          </div>
          <div v-if="booking" class="px-2 py-1 bg-sta-green-dark">
            <div class="flex justify-between md:mb-2">
              <h3 class="text-lg font-semibold">Booking Information</h3>
              <nuxt-link
                :to="`bookings/${booking.reference}`"
                class="block px-2 py-1 transition-colors bg-sta-orange hover:bg-sta-orange-dark"
              >
                View / Check-in Booking
              </nuxt-link>
            </div>
            <div class="hidden space-x-4 md:flex">
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
                  <td class="px-1 pb-1">
                    {{ ticketGroup.concessionType.name }},
                  </td>
                  <td class="px-1 pb-1">{{ ticketGroup.seatGroup.name }}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <div class="mt-3 text-xs">
          Booking Reference: {{ scanData.bookingReference }} | Ticket ID:
          {{ scanData.ticketId }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AudioPositive from '@/assets/audio/beep_positive.mp3'
import AudioNegative from '@/assets/audio/beep_negative.mp3'
export default {
  props: {
    alreadyCheckedIn: {
      type: Boolean,
      default: false,
    },
    scanData: {
      type: Object,
      required: true,
    },
    errors: {
      type: Array,
      default: null,
    },
    ticket: {
      type: Object,
      default: null,
    },
    booking: {
      type: Object,
      default: null,
    },
  },
  mounted() {
    let audio = new Audio(AudioPositive)
    if (this.errors) audio = new Audio(AudioNegative)
    audio.play()
  },
}
</script>
