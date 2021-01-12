<template>
  <overview-box>
    <template v-slot:title>Your Details</template>
    <template v-slot:subtitle> Joe Bloogs </template>
    <div>joe.bloggs@example.org</div>
  </overview-box>
</template>

<script>
import OverviewBox from '@/components/overview/OverviewBox.vue';

export default {
  name: 'user-overview',
  components: { OverviewBox },
  props: {
    booking: {
      required: true,
    },
  },
  data() {
    return {
      user: null,
    };
  },
};
</script>
