<template>
  <overview-box>
    <template v-slot:title
      ><font-awesome-icon icon="ticket-alt" class="mr-2" /> Tickets</template
    >
    <template v-slot:message_box>
      <table class="ml-auto table-auto">
        <tr>
          <th class="pr-4">
            <font-awesome-icon
              icon="info-circle"
              class="flex items-center text-h3 lg:text-h2"
            />
          </th>
          <td class="text-xs lg:text-sm">
            <p>All our tickets are fulfilled digitally.</p>
            <p>Display on your phone or print</p>
          </td>
        </tr>
      </table>
    </template>
    <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <div
        v-for="(groupedConcessions, index) in seatGroupedTickets"
        :key="index"
        class="p-2 px-4 rounded bg-sta-gray"
      >
        <span class="font-semibold text-sta-orange"
          >{{ groupedConcessions[0].seat_group.name }}
        </span>
        <div
          v-for="(concession, concession_index) in groupedConcessions"
          :key="concession_index"
        >
          <strong>{{ concession.number }}</strong> x
          {{ concession.concession_type.name }}
        </div>
      </div>
    </div>
  </overview-box>
</template>

<script>
import lo from 'lodash';

import Booking from '@/classes/Booking';
import OverviewBox from '@/components/overview/OverviewBox.vue';

export default {
  name: 'tickets-overview',
  components: { OverviewBox },
  props: {
    booking: {
      required: true,
      type: Booking,
    },
  },
  computed: {
    seatGroupedTickets() {
      return lo.groupBy(
        this.booking.ticket_overview(),
        (concessionTickets) => concessionTickets.seat_group.id
      );
    },
  },
};
</script>
