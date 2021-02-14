<template>
  <overview-box>
    <template v-slot:title>{{ production.name }}</template>
    <template v-slot:subtitle>
      {{ performance.start | dateFormat('EEEE d MMMM kkkk') }}
    </template>
    <div class="font-semibold text-sta-green">
      <p>Doors Open: {{ performance.doorsOpen | dateFormat('T') }}</p>
      <p>Performance Starts: {{ performance.start | dateFormat('T') }}</p>
    </div>
  </overview-box>
</template>

<script>
import OverviewBox from './OverviewBox.vue';

export default {
  name: 'performance-overview-box',
  components: { OverviewBox },
  props: {
    production: {
      required: true,
    },
    performance: {
      required: true,
    },
  },
};
</script>
