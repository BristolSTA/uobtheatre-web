<template>
  <div class="flex flex-col p-4 pt-2 text-black bg-white rounded-xl">
    <h1 class="text-h2">
      {{ performance.production.name }}
    </h1>
    <p>
      {{ dateFormat(performance.start, 'EEEE d MMMM kkkk') }}
    </p>
    <p>
      <span class="pr-2">
        Doors: {{ dateFormat(performance.doorsOpen, 't') }}
      </span>
      |
      <span class="pl-2">
        Start: {{ dateFormat(performance.start, 't') }}
      </span>
    </p>
    <div
      v-if="ticket.concessionType.name && ticket.seatGroup.name"
      class="flex justify-between w-full font-semibold"
    >
      <p class="pr-1">1x {{ ticket.concessionType.name }}</p>
      <p class="pl-1 text-right">
        {{ ticket.seatGroup.name }}
      </p>
    </div>
    <div class="flex flex-grow items-center justify-center py-2 w-full">
      <qrcode-vue
        :value="ticket.generateQRCodeString(reference)"
        level="L"
        :size="240"
      />
    </div>
    <p>
      Booking Ref: <span class="font-mono">{{ reference }}</span>
    </p>
    <div v-if="fullName" class="flex justify-between w-full">
      <p>Booked By: {{ fullName }}</p>
    </div>
    <p class="text-right text-gray-400 font-mono text-sm italic">
      {{ ticket.id }}
    </p>
  </div>
</template>

<script>
import lo from 'lodash';
import QrcodeVue from 'qrcode.vue';

import Ticket from '@/classes/Ticket';
import { dateFormat } from '@/utils/datetime';

export default {
  name: 'Ticket',
  components: {
    QrcodeVue
  },
  props: {
    performance: {
      required: true,
      type: Object
    },
    reference: {
      required: true,
      type: String
    },
    ticket: {
      required: true,
      type: Ticket
    },
    user: {
      default: null,
      type: Object
    }
  },
  computed: {
    fullName() {
      return this.user
        ? lo.join([this.user.firstName, this.user.lastName], ' ')
        : null;
    }
  },
  methods: {
    dateFormat
  }
};
</script>
