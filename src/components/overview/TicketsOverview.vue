<template>
  <div>
    <overview-box :subtitle="false">
      <template v-slot:title>Tickets</template>
      <div>Warning message</div>
      <div>Ticket breakdown</div>
    </overview-box>
  </div>
</template>

<script>
import OverviewBox from '@/components/overview/OverviewBox.vue';

export default {
  name: 'tickets-overview',
  components: { OverviewBox },
  props: {
    booking: {
      required: true,
    },
  },
};
</script>
