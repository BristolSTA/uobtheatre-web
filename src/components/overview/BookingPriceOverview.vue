<template>
  <div>
    <overview-box :subtitle="false">
      <template v-slot:title>Price</template>
      <div>Price breakdown</div>
    </overview-box>
  </div>
</template>

<script>
import OverviewBox from '@/components/overview/OverviewBox.vue';

export default {
  name: 'booking-price-overview',
  components: { OverviewBox },
  props: {
    booking: {
      required: true,
    },
  },
};
</script>
