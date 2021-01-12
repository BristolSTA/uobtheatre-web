<template>
  <overview-box :subtitle="false" :msgbox="true">
    <template v-slot:title>Tickets</template>
    <template v-slot:msgbox>
      <table>
        <tr>
          <td>
            <font-awesome-icon
              icon="info-circle"
              class="flex items-center text-h3 lg:text-h2"
            />
          </td>
          <td class="text-xs lg:text-sm">
            <p>All our tickets are fulfilled digitally.</p>
            <p>Display on your phone or in print</p>
          </td>
        </tr>
      </table>
    </template>
    <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <div
        v-for="(seatgroup_group, sg_index) in grp_by_seatgroup_and_conc"
        :key="sg_index"
      >
        <span class="font-semibold text-sta-orange"
          >{{ seatgroup_group[0].tickets[0].seat_group.name }}
        </span>
        <div
          v-for="(concession_typ_grp, ct_index) in seatgroup_group"
          :key="ct_index"
        >
          {{ concession_typ_grp.tickets.length }} x
          {{ concession_typ_grp.tickets[0].concession_type.name }}
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
    grp_by_seatgroup_and_conc() {
      return lo.map(
        lo.groupBy(this.booking.tickets, (ticket) => ticket.seat_group.id),
        (tickets) =>
          lo.map(
            lo.groupBy(tickets, (ticket) => ticket.concession_type.id),
            (tickets) => ({
              tickets,
            })
          )
      );
    },
  },
};
</script>
