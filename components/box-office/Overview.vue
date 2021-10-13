<template>
  <div
    class="
      p-2
      px-4
      bg-sta-gray-dark
      border-2 border-sta-gray-light
      sm:p-4 sm:px-8
      lg:px-12
    "
  >
    <div class="flex flex-wrap">
      <div class="flex justify-center w-full sm:block sm:w-1/2">
        <div>
          <p class="text-h2">{{ production.name }}</p>
          <p class="-mt-2 mb-1 text-sta-gray-lighter font-semibold">
            by {{ production.society.name }}
          </p>
          <p class="text-sta-orange">
            {{ performance.start | dateFormat('cccc d MMM y') }}
          </p>
        </div>
      </div>
      <div class="w-full sm:w-1/2">
        <clock class="py-2 text-center text-5xl md:text-6xl" />
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
            <div class="m-2 px-3 py-2 w-max bg-sta-rouge">
              <p class="font-semibold">Warnings:</p>
              <div v-for="(warning, index) in production.warnings" :key="index">
                <p class="px-2">- {{ warning.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="detailed" class="flex justify-center w-full sm:w-1/2">
        <div class="mx-4 p-4 max-w-sm bg-sta-gray-light lg:px-10">
          <table class="table-fixed w-full">
            <tr>
              <td class="font-semibold">Total Tickets</td>
              <td class="pl-2 w-1/5 text-sta-orange font-mono">
                {{ ticketBreakdown.totalCapacity }}
              </td>
            </tr>
            <tr>
              <td class="font-semibold">Total Sold</td>
              <td class="pl-2 w-1/5 text-sta-orange font-mono">
                {{ ticketBreakdown.totalTicketsSold }}
              </td>
            </tr>
            <tr>
              <td class="pl-6 font-semibold">Collected</td>
              <td class="pl-2 w-1/5 text-sta-orange font-mono">
                {{ ticketBreakdown.totalTicketsCheckedIn }}
              </td>
            </tr>
            <tr>
              <td class="pl-6 font-semibold">To be Collected</td>
              <td class="pl-2 w-1/5 text-sta-orange font-mono">
                {{ ticketBreakdown.totalTicketsToCheckIn }}
              </td>
            </tr>
            <tr>
              <td class="font-semibold">Available to Sell</td>
              <td class="pl-2 w-1/5 text-sta-orange font-mono">
                {{ ticketBreakdown.totalTicketsAvailable }}
              </td>
            </tr>
          </table>
          <div class="flex items-center text-sta-rouge space-x-2">
            <span class="relative flex w-3 h-3">
              <span
                class="
                  absolute
                  inline-flex
                  w-full
                  h-full
                  bg-sta-rouge
                  rounded-full
                  animate-ping
                "
              ></span>
              <span
                class="relative inline-flex w-3 h-3 bg-sta-rouge rounded-full"
              ></span>
            </span>
            <p>Live</p>
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
    }
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
      skip() {
        return !this.detailed
      },
      pollInterval: 5000,
      update: (data) => data.performance.ticketsBreakdown,
    },
  },
}
</script>
