<template>
  <div
    class="relative p-2"
    :class="[errors ? 'bg-sta-orange' : 'bg-sta-green']"
  >
    <div class="absolute right-0 top-0 m-6 md:m-0 md:mr-2">
      <font-awesome-icon
        icon="times"
        class="fa-2x cursor-pointer"
        @click="$emit('close')"
      />
    </div>
    <div
      class="flex flex-col justify-evenly text-center md:flex-row md:text-left md:space-x-6"
    >
      <div class="w-full text-center md:w-16">
        <font-awesome-icon
          :icon="errors ? 'exclamation' : 'check'"
          class="fa-4x my-auto"
        />
      </div>
      <div class="flex-grow">
        <div
          class="flex flex-col justify-between md:flex-row md:mr-10 md:space-x-6"
        >
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
            <p>
              Type: <strong>{{ ticket.concessionType.name }}</strong>
            </p>
            <p>
              Location: <strong>{{ ticket.seatGroup.name }}</strong>
            </p>
          </div>
          <div class="flex flex-col gap-3 lg:flex-row">
            <button
              v-if="
                !errors &&
                booking &&
                booking.tickets.length &&
                booking.tickets.some((ticket) => !ticket.checkedIn)
              "
              class="block px-2 py-1 bg-sta-orange hover:bg-sta-orange-dark transition-colors"
              @click="$emit('checkInAll')"
            >
              Check in all tickets in booking
            </button>
            <div
              class="px-2 py-1"
              :class="[errors ? 'bg-sta-orange-dark' : 'bg-sta-green-dark']"
            >
              <div class="flex justify-between space-x-2 md:mb-2">
                <h3 class="text-lg font-semibold">
                  Booking Information
                  <template v-if="booking">
                    ({{ booking.tickets.length }} tickets)
                  </template>
                </h3>
                <nuxt-link
                  :to="`bookings?q=${scanData.bookingReference}&qTicket=${scanData.ticketId}`"
                  class="block px-2 py-1 transition-colors"
                  :class="[
                    errors
                      ? 'bg-sta-green hover:bg-sta-green-dark'
                      : 'bg-sta-orange hover:bg-sta-orange-dark'
                  ]"
                >
                  View Booking
                </nuxt-link>
              </div>
              <div class="hidden space-x-8 md:flex">
                <div>
                  <p>Reference: {{ scanData.bookingReference }}</p>
                  <p v-if="booking && booking.user">
                    User: {{ booking.user.firstName }}
                    {{ booking.user.lastName }}
                  </p>
                  <p v-if="booking && booking.tickets">
                    <strong
                      >{{ booking.tickets.length }} tickets ({{
                        bookingInstance.numberCheckedIn
                      }}
                      checked in)</strong
                    >
                  </p>
                </div>
                <table v-if="booking && booking.priceBreakdown">
                  <tr
                    v-for="(ticketGroup, index) in booking.priceBreakdown
                      .tickets"
                    :key="index"
                    class="text-sm border"
                  >
                    <td class="pb-1 px-1 whitespace-nowrap">
                      {{ ticketGroup.number }} x
                    </td>
                    <td class="pb-1 px-1">
                      {{ ticketGroup.concessionType.name }},
                    </td>
                    <td class="pb-1 px-1">
                      {{ ticketGroup.seatGroup.name }}
                    </td>
                  </tr>
                </table>
              </div>
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
import AudioPositive from '@/assets/audio/beep_positive.mp3';
import AudioNegative from '@/assets/audio/beep_negative.mp3';
import Booking from '@/classes/Booking';
export default defineNuxtComponent({
  props: {
    alreadyCheckedIn: {
      type: Boolean,
      default: false
    },
    scanData: {
      type: Object,
      required: true
    },
    errors: {
      type: Array,
      default: null
    },
    ticket: {
      type: Object,
      default: null
    },
    booking: {
      type: Object,
      default: null
    }
  },
  computed: {
    bookingInstance() {
      return Booking.fromAPIData(this.booking);
    }
  },
  mounted() {
    new Audio(this.errors ? AudioNegative : AudioPositive).play();
  }
});
</script>
