<template>
  <div
    class="p-4 pt-2 text-black bg-white rounded-xl"
    style="max-width: 320px; min-width: 240px"
  >
    <h1 class="text-h2">TRASh</h1>
    <p>
      Date: {{ booking.performance.start | dateFormat('EEEE d MMMM kkkk') }}
    </p>
    <p>Doors: {{ booking.performance.doorsOpen | dateFormat('T') }}</p>
    <p>Start: {{ booking.performance.start | dateFormat('T') }}</p>
    <div class="flex justify-between w-full font-semibold">
      <p>1x {{ ticket.concession_type.name }}</p>
      <p class="text-right">{{ ticket.seat_group.name }}</p>
    </div>
    <div class="flex justify-center w-full py-2">
      <qrcode-vue :value="qrString" level="L" size="240" />
    </div>
    <p>Booking Ref: {{ booking.bookingReference }}</p>
    <!-- <p>Paid On: 3 Jan 2020</p> -->
    <div class="flex justify-between w-full">
      <p>Booked By: {{ fullName }}</p>
      <p class="text-sm italic text-right text-gray-500">
        {{ ticketNum }}
      </p>
    </div>
  </div>
</template>

<script>
import lo from 'lodash';
import QrcodeVue from 'qrcode.vue';

import Booking from '@/classes/Booking';

export default {
  name: 'Ticket',
  components: {
    QrcodeVue,
  },
  props: {
    booking: {
      required: true,
      type: Booking,
    },
    ticket: {
      required: true,
      type: Object,
    },
    user: {
      required: true,
      type: Object,
    },
    index: {
      required: true,
      type: Number,
    },
  },
  computed: {
    qrString() {
      return lo.join(
        [
          `ref:${this.booking.bookingReference}`,
          `concessionType:${this.ticket.concession_type.name}`,
          `seatGroup:${this.ticket.seat_group.name}`,
          `user:${this.fullName}`,
          `ticketNum:${this.ticketNum}`,
        ],
        ';'
      );
    },
    fullName() {
      return lo.join([this.user.firstName, this.user.lastName], ' ');
    },
    ticketNum() {
      return ('0' + this.index).slice(-2);
    },
  },
};
</script>
