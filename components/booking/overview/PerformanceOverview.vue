<template>
  <card>
    <template #title>
      <font-awesome-icon icon="theater-masks" class="mr-2" />
      Performance
    </template>
    <template #messageBox>
      <slot></slot>
    </template>
    <template #subtitle>
      <p class="text-h3">
        {{ humanDayTime(startTime) }} of
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
        {{ humanDuration(performance.durationMins) }}
        <template v-if="performance.intervalDurationMins"
          >inc. {{ performance.intervalDurationMins }} min interval</template
        >
      </icon-list-item>
    </div>
  </card>
</template>

<script>
import IconListItem from '@/components/ui/IconListItem.vue'

import { humanDuration, humanDayTime } from '@/utils'
import { DateTime } from 'luxon'
import Card from '../../ui/Card.vue'

export default {
  name: 'PerformanceOverviewBox',
  components: { Card, IconListItem },
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
    startTime() {
      return DateTime.fromISO(self.performance.start)
    },
  },
  methods: {
    humanDuration,
    humanDayTime,
  },
}
</script>
