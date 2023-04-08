<template>
  <overview-box>
    <template #title>
      <font-awesome-icon icon="info" class="mr-2" />
      Accessibility Info
    </template>
    <div class="p-2 px-4 bg-sta-gray rounded">
      {{ booking.accessibilityInfo }}
    </div>
  </overview-box>
</template>

<script>
import lo from 'lodash';

import OverviewBox from '../../ui/UiCard.vue';
import Booking from '~~/classes/Booking';

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
