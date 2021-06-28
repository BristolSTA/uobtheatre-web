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
              <td class="w-1/5 pl-2 font-mono text-sta-orange">
                {{ ticketBreakdown.totalCapacity }}
              </td>
            </tr>
            <tr>
              <td class="font-semibold">Total Sold</td>
              <td class="w-1/5 pl-2 font-mono text-sta-orange">
                {{ ticketBreakdown.totalTicketsSold }}
              </td>
            </tr>
            <tr>
              <td class="pl-6 font-semibold">Collected</td>
              <td class="w-1/5 pl-2 font-mono text-sta-orange">
                {{ ticketBreakdown.totalTicketsCheckedIn }}
              </td>
            </tr>
            <tr>
              <td class="pl-6 font-semibold">To be Collected</td>
              <td class="w-1/5 pl-2 font-mono text-sta-orange">
                {{ ticketBreakdown.totalTicketsToCheckIn }}
              </td>
            </tr>
            <tr>
              <td class="font-semibold">Avaliable to Sell</td>
              <td class="w-1/5 pl-2 font-mono text-sta-orange">
                {{ ticketBreakdown.totalTicketsAvailable }}
              </td>
            </tr>
          </table>
          <div
            v-if="lastUpdate"
            class="text-sm text-right text-sta-gray-lighter"
          >
            Last updated
            {{ lastUpdatedText }} ago
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
  data() {
    return {
      ticketBreakdown: {},
      lastUpdate: null,
      lastUpdatedText: null,
      timer: null,
    }
  },
  watch: {
    ticketBreakdown: {
      deep: true,
      handler() {
        console.log('Changed!')
      },
    },
  },
  mounted() {
    this.timer = setInterval(() => {
      this.lastUpdatedText = humanDuration(
        Math.round((new Date() - this.lastUpdate) / 1000) / 60
      )
    }, 500)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    humanDuration,
  },
  apollo: {
    ticketBreakdown: {
      query: require('@/graphql/queries/box-office/BoxOfficePerformanceTicketBreakdown.gql'),
      variables() {
        return {
          id: this.performance.id,
        }
      },
      pollInterval: 5000,
      update: (data) => data.performance.ticketsBreakdown,
      result() {
        console.log('asd')
        this.lastUpdate = new Date()
      },
    },
  },
}
</script>
