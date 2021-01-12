<template>
  <overview-box :subtitle="false">
    <template v-slot:title>Tickets</template>
    <div>Warning message</div>
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
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
    ticket_types_data: {
      required: true,
    },
  },
  computed: {
    grp_by_seatgroup_and_conc() {
      return lo.map(
        lo.groupBy(
          this.expected_output_data.tickets,
          (ticket) => ticket.seat_group.id
        ),
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
