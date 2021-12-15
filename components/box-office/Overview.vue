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
    <div
      v-if="status.bannerText"
      class="text-center p-2 mb-1"
      :class="status.bannerClass"
    >
      {{ status.bannerText }}
    </div>
    <div class="flex flex-wrap">
      <div class="flex justify-center w-full md:block md:w-auto">
        <div>
          <p class="text-h2">{{ production.name }}</p>
          <p class="-mt-2 mb-1 text-sta-gray-lighter font-semibold">
            by {{ production.society.name }}
          </p>
          <p class="text-sta-orange">
            {{ performance.start | dateFormat('cccc d MMM y') }}
          </p>
        </div>
        <div v-if="detailed" class="hidden md:block">
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
            <div v-if="production.warnings.length" class="flex justify-center">
              <div class="m-2 px-3 py-2 w-full bg-sta-rouge">
                <p class="font-semibold">Warnings:</p>
                <div
                  v-for="(warning, index) in production.warnings"
                  :key="index"
                >
                  <p class="px-2">- {{ warning.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-center flex-col xl:flex-row flex-auto">
        <div class="flex-grow text-center xl:pt-2">
          <clock
            class="py-2 text-5xl md:text-6xl xl:text-7xl"
            :class="status.clockClass"
            @time="currentTime = $event"
          />
        </div>
        <div>
          <div v-if="detailed" class="flex flex-grow-0 justify-center">
            <div class="p-4 max-w-sm bg-sta-gray-light lg:px-10 xl:my-4">
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
                    class="
                      relative
                      inline-flex
                      w-3
                      h-3
                      bg-sta-rouge
                      rounded-full
                    "
                  ></span>
                </span>
                <p>Live</p>
              </div>
            </div>
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
      currentTime: new Date(),
    }
  },
  computed: {
    performanceDoorsDiffMinutes() {
      return (Date.parse(this.performance.doorsOpen) - this.currentTime) / 60000
    },
    performanceStartDiffMinutes() {
      return (Date.parse(this.performance.start) - this.currentTime) / 60000
    },
    performanceEndDiffMinutes() {
      return (Date.parse(this.performance.end) - this.currentTime) / 60000
    },
    status() {
      // Performance end is in the past
      if (this.performanceEndDiffMinutes <= 0)
        return {
          clockClass: null,
          bannerClass: 'bg-sta-rouge',
          bannerText:
            'This performance is in the past. Are you sure you are viewing the right performance?',
        }

      // Performance has started
      if (this.performanceStartDiffMinutes <= 0)
        return {
          clockClass: 'text-sta-rouge',
          bannerClass: 'bg-sta-rouge',
          bannerText: 'This performance should now have started',
        }

      // Performance is starting within 5 minutes
      if (this.performanceStartDiffMinutes <= 5)
        return {
          clockClass: 'text-sta-orange animate-pulse',
          bannerClass: 'bg-sta-orange',
          bannerText: `This performance is due to start in ${humanDuration(
            this.performanceStartDiffMinutes
          )}`,
        }

      // Performance doors are open
      if (this.performanceDoorsDiffMinutes < 0)
        return {
          clockClass: 'text-sta-green',
          bannerClass: 'bg-sta-green',
          bannerText: `The doors should now be open (wait for clearance from your stage team)`,
        }

      // Performance doors are opening within 5 minutes
      if (this.performanceDoorsDiffMinutes <= 5)
        return {
          clockClass: 'animate-pulse',
          bannerClass: 'bg-sta-orange',
          bannerText: `Doors should be opening in ${humanDuration(
            this.performanceDoorsDiffMinutes
          )} (wait for clearance from your stage team)`,
        }

      // Performance is within 3 hours
      if (this.performanceDoorsDiffMinutes >= 3 * 60) {
        return {
          bannerClass: 'bg-sta-rouge',
          bannerText: `This performance is over 3 hours away. Are you sure you have the right performance selected?`,
        }
      }

      // Within 3 hours of start
      return {
        bannerText: `Doors opening in ${humanDuration(
          this.performanceDoorsDiffMinutes
        )}`,
        bannerClass: 'border',
      }
    },
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
