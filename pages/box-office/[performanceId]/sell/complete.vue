<template>
  <div v-if="booking.reference">
    <box-office-navigation :performance="booking.performance" />

    <h2 class="text-h2">Booking Complete!</h2>
    <h3 class="text-gray-500 text-h3">Reference {{ booking.reference }}</h3>
    <div class="grid gap-4 grid-cols-1 mb-6 md:grid-cols-2">
      <tickets-overview :booking="booking" />
      <payment-overview :booking="booking" />
    </div>
    <div class="flex flex-col mb-2">
      <div class="flex justify-center mb-2">
        <button
          v-if="!checkedIn"
          class="btn btn-green font-semibold animate-pulse animate w-52"
          @click="changeTicketStatus(true)"
          @keypress="changeTicketStatus(true)"
        >
          Check In Tickets
        </button>
        <template v-else>
          <button
            class="btn btn-outline btn-rouge font-semibold mr-1 w-52"
            @click="changeTicketStatus(false)"
            @keypress="changeTicketStatus(false)"
          >
            Revert Check-In
          </button>
          <button class="btn btn-outline disabled ml-1 w-52" disabled>
            Tickets Checked In
          </button>
        </template>
      </div>
      <div class="flex justify-center">
        <button
          class="btn btn-orange font-semibold"
          @click="goToMenu()"
          @keypress="goToMenu()"
        >
          Back to Menu
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { DateTime } from 'luxon';
import Booking from '@/classes/Booking';
import TicketsOverview from '@/components/booking/overview/TicketsOverview.vue';
import PaymentOverview from '@/components/booking/overview/PaymentOverview.vue';
import CheckInTickets from '@/graphql/mutations/box-office/CheckInTickets.gql';
import UnCheckInTickets from '@/graphql/mutations/box-office/UnCheckInTickets.gql';

import { performMutation } from '~~/utils/api';
import { successToast, errorToast } from '~~/utils/alerts';
import BoxOfficeNavigation from '@/components/box-office/BoxOfficeNavigation.vue';
import useBoxOfficeStore from '@/store/box-office';
const boxOfficeStore = useBoxOfficeStore();

import { defineNuxtComponent } from '#app';

export default defineNuxtComponent({
  components: { TicketsOverview, PaymentOverview, BoxOfficeNavigation },
  props: {
    booking: {
      required: true,
      type: Booking
    }
  },
  data() {
    return {
      checkedIn: false
    };
  },
  mounted() {
    if (!this.booking.reference) {
      return this.$router.push('../');
    }

    if (this.canAutoCheckIn()) {
      this.changeTicketStatus(true);
    }
  },
  beforeUnmount() {
    // Remove stored booking ID
    boxOfficeStore.$patch({ inProgressBookingID: undefined });
  },
  methods: {
    canAutoCheckIn() {
      return this.performanceDoorsDiffMinutes() <= 15;
    },
    performanceDoorsDiffMinutes() {
      return DateTime.fromISO(this.booking.performance.doorsOpen)
        .diff(DateTime.now())
        .as('minutes');
    },
    async changeTicketStatus(checkingIn) {
      try {
        await performMutation(
          this.$apollo,
          {
            mutation: checkingIn ? CheckInTickets : UnCheckInTickets,
            variables: {
              reference: this.booking.reference,
              performanceId: this.booking.performance.id,
              tickets: this.booking.tickets.map((ticket) => {
                return {
                  ticketId: ticket.id
                };
              })
            }
          },
          checkingIn ? 'checkInBooking' : 'uncheckInBooking'
        );

        this.checkedIn = checkingIn;
        successToast.fire({
          timer: 4000,
          title: !checkingIn
            ? 'Tickets un-checked in'
            : this.canAutoCheckIn()
            ? 'Tickets automatically checked in'
            : 'Tickets un-checked in'
        });
      } catch (e) {
        errorToast.fire({
          title: checkingIn
            ? 'Unable to check in tickets'
            : 'Unable to un-check in tickets'
        });
      }
    },
    goToMenu() {
      this.$router.push(`/box-office/${this.booking.performance.id}`);
    }
  }
});
</script>
