<template>
  <overview-box>
    <template #title>
      <font-awesome-icon icon="theater-masks" class="mr-2" />
      Performance
    </template>
    <template #subtitle>
      <p class="text-h3">
        {{ performance.start | dateFormat('EEEE d MMMM kkkk') }}
      </p>
    </template>
    <div>
      <div class="font-semibold">
        <p class="py-1 text-sta-green">
          Doors Open: {{ performance.doorsOpen | dateFormat('T') }}
        </p>
        <p class="pb-0.5 text-sta-rouge">
          Performance Starts: {{ performance.start | dateFormat('T') }}
        </p>
      </div>
      <icon-list-item icon="clock">
        {{ humanDuration }}
      </icon-list-item>
    </div>
  </overview-box>
</template>

<script>
import humanizeDuration from 'humanize-duration'

import IconListItem from '@/components/ui/IconListItem.vue'

import OverviewBox from './OverviewBox.vue'

export default {
  name: 'PerformanceOverviewBox',
  components: { OverviewBox, IconListItem },
  props: {
    production: {
      required: true,
      type: Object,
    },
    performance: {
      required: true,
      type: Object,
    },
  },
  computed: {
    humanDuration() {
      return humanizeDuration(this.performance.durationMins * 60 * 1000)
    },
  },
}
</script>
