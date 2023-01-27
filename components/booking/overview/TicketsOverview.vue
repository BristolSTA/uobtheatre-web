<template>
  <overview-box>
    <template #title>
      <font-awesome-icon icon="ticket" class="mr-2" />
      Tickets
    </template>
    <template #messageBox>
      <table class="flex table-auto ml-auto">
        <tr>
          <th class="pr-4">
            <font-awesome-icon
              icon="info-circle"
              class="flex items-center text-h3 lg:text-h2"
            />
          </th>
          <td class="text-xs lg:text-sm">
            <p>All our tickets are fulfilled digitally</p>
            <p>Display on your phone or print</p>
          </td>
        </tr>
      </table>
    </template>
    <div class="grid gap-2 grid-cols-1 sm:grid-cols-2">
      <div
        v-for="(groupedConcessions, index) in seatGroupedTickets"
        :key="index"
        class="p-2 px-4 bg-sta-gray rounded"
      >
        <span class="text-sta-orange font-semibold">
          {{ groupedConcessions[0].seatGroup.name }}
        </span>
        <div
          v-for="(concession, concession_index) in groupedConcessions"
          :key="concession_index"
        >
          <strong class="font-mono">{{ concession.number }}</strong> x
          {{ concession.concessionType.name }}
        </div>
      </div>
    </div>
  </overview-box>
</template>

<script>
import lo from 'lodash';

import OverviewBox from '../../ui/UiCard.vue';
import Booking from '@/classes/Booking';

export default {
  name: 'TicketsOverview',
  components: { OverviewBox },
  props: {
    booking: {
      required: true,
      type: Booking
    }
  },
  computed: {
    seatGroupedTickets() {
      return lo.groupBy(
        this.booking.ticketOverview(),
        (concessionTickets) => concessionTickets.seatGroup.id
      );
    }
  }
};
</script>
