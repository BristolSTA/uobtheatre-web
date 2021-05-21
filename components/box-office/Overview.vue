<template>
  <div
    class="p-2 px-4 border-2 lg:px-12 sm:p-4 sm:px-8 bg-sta-gray-dark border-sta-gray-light"
  >
    <div class="flex flex-wrap">
      <div class="flex justify-center w-full sm:block sm:w-1/2">
        <div>
          <p class="text-h2">{{ production.name }}</p>
          <p class="mb-1 -mt-2 font-semibold text-sta-gray-lighter">
            by {{ production.society.name }}
          </p>
          <p class="text-sta-orange">
            {{ performance.start | dateFormat('cccc d MMM y') }}
          </p>
        </div>
      </div>
      <div class="w-full sm:w-1/2">
        <clock class="py-2 text-5xl text-center md:text-6xl" />
      </div>
      <div v-if="detailed" class="hidden w-full sm:block sm:w-1/2">
        <div>
          <p class="text-sta-green">
            Doors Open: {{ performance.doorsOpen | dateFormat('t') }}
          </p>
          <p class="text-sta-rouge">
            Performance Starts: {{ performance.start | dateFormat('t') }}
          </p>
          <icon-list-item icon="clock">
            {{ humanDuration(performance.durationMins) }}
          </icon-list-item>
          <div
            v-if="production.warnings.length"
            class="flex justify-center sm:block"
          >
            <div class="px-3 py-2 m-2 w-max bg-sta-rouge">
              <p class="font-semibold">Warnings:</p>
              <div v-for="(warning, index) in production.warnings" :key="index">
                <p class="px-2">- {{ warning.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="detailed" class="flex justify-center w-full sm:w-1/2">
        <div class="max-w-sm p-4 mx-4 lg:px-10 bg-sta-gray-light">
          <table class="w-full table-fixed">
            <tr>
              <td class="font-semibold">Total Tickets</td>
              <td class="w-1/5 pl-2 font-mono text-sta-orange">200</td>
            </tr>
            <tr>
              <td class="font-semibold">Total Sold</td>
              <td class="w-1/5 pl-2 font-mono text-sta-orange">150</td>
            </tr>
            <tr>
              <td class="pl-6 font-semibold">Collected</td>
              <td class="w-1/5 pl-2 font-mono text-sta-orange">100</td>
            </tr>
            <tr>
              <td class="pl-6 font-semibold">To be Collected</td>
              <td class="w-1/5 pl-2 font-mono text-sta-orange">50</td>
            </tr>
            <tr>
              <td class="font-semibold">Avaliable to Sell</td>
              <td class="w-1/5 pl-2 font-mono text-sta-orange">50</td>
            </tr>
          </table>
          <div class="text-sm text-right text-sta-gray-lighter">
            Last updated x seconds ago
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconListItem from '@/components/ui/IconListItem.vue'
import { humanDuration } from '@/utils'
import Clock from '@/components/ui/Clock.vue'

export default {
  name: 'Overview',
  components: {
    IconListItem,
    Clock,
  },
  props: {
    production: {
      required: true,
      type: Object,
    },
    performance: {
      required: true,
      type: Object,
    },
    detailed: {
      default: true,
      type: Boolean,
    },
  },
  methods: {
    humanDuration,
  },
}
</script>
