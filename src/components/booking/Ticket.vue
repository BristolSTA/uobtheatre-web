<template>
  <div class="flex flex-col p-4 pt-2 text-black bg-white rounded-xl">
    <h1 class="text-h2">
      {{ booking.performance.production.name }}
    </h1>
    <p>
      {{ booking.performance.start | dateFormat('EEEE d MMMM kkkk') }}
    </p>
    <p>
      <span class="pr-2">
        Doors: {{ booking.performance.doorsOpen | dateFormat('t') }}
      </span>
      |
      <span class="pl-2">
        Start: {{ booking.performance.start | dateFormat('t') }}
      </span>
    </p>
    <div class="flex justify-between w-full font-semibold">
      <p class="pr-1">1x {{ ticket.concession_type.name }}</p>
      <p class="pl-1 text-right">{{ ticket.seat_group.name }}</p>
    </div>
    <div class="flex items-center justify-center flex-grow w-full py-2">
      <qrcode-vue
        :value="ticket.generateQRCodeString(booking.reference)"
        level="L"
        size="240"
      />
    </div>
    <p>Booking Ref: {{ booking.reference }}</p>
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
import Ticket from '@/classes/Ticket';

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
      type: Ticket,
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
    fullName() {
      return lo.join([this.user.firstName, this.user.lastName], ' ');
    },
    ticketNum() {
      return ('0' + this.index).slice(-2);
    },
  },
};
</script>
