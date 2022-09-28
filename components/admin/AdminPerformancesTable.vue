<template>
  <paginated-table
    :items="
      performancesData ? performancesData.edges.map((edge) => edge.node) : []
    "
    empty-text="This production currently has no performances"
    :max-per-page="10"
    :loading="loading"
    :page-info="performancesData ? performancesData.pageInfo : {}"
    :offset.sync="performancesOffset"
  >
    <template #head>
      <table-head-item></table-head-item>
      <table-head-item>Date</table-head-item>
      <table-head-item>Doors Time</table-head-item>
      <table-head-item>Venue</table-head-item>
      <table-head-item>Sales</table-head-item>
      <table-head-item></table-head-item>
    </template>
    <template #default="slotProps">
      <table-row v-for="performance in slotProps.items" :key="performance.id">
        <table-row-item>
          <performance-status-badge :performance="performance" />
          <badge
            v-if="performance.minSeatPrice === 0"
            class="text-white bg-sta-orange font-bold"
            >Free</badge
          >
        </table-row-item>
        <table-row-item>
          {{ performance.start | dateFormat('EEEE dd MMMM y') }}
        </table-row-item>
        <table-row-item>
          {{ performance.doorsOpen | dateFormat('HH:mm ZZZZ') }}
          <span class="text-sm">
            ({{ humanDuration(performance.durationMins)
            }}<template v-if="performance.intervalDurationMins">
              inc. interval</template
            >)
          </span>
        </table-row-item>
        <table-row-item>{{ performance.venue.name }}</table-row-item>
        <table-row-item>
          <template v-if="performance.ticketsBreakdown.totalCapacity">
            <p>
              {{ performance.ticketsBreakdown.totalTicketsSold }} of
              {{ performance.ticketsBreakdown.totalCapacity }} ({{
                salesPercentage(performance)
              }}%)
            </p>
            <progress-bar
              :height="2"
              :percentage="parseInt(salesPercentage(performance))"
            />
          </template>
        </table-row-item>
        <table-row-item class="space-x-2">
          <slot name="rowAction" :performance="performance"></slot>
        </table-row-item>
      </table-row>
    </template>
    <template #empty>
      <div class="flex items-center justify-center">
        <nuxt-link
          class="bg-sta-green py-1 px-2 rounded-full hover:bg-sta-green-dark"
          :to="`${production.slug}/performances/create`"
        >
          Add a performance?
        </nuxt-link>
      </div>
    </template>
  </paginated-table>
</template>

<script>
import ProgressBar from '@/components/ui/ProgressBar.vue'
import PerformanceStatusBadge from '@/components/performance/PerformanceStatusBadge.vue'
import TableRowItem from '@/components/ui/Tables/TableRowItem.vue'
import TableHeadItem from '@/components/ui/Tables/TableHeadItem.vue'
import PaginatedTable from '@/components/ui/Tables/PaginatedTable.vue'
import TableRow from '@/components/ui/Tables/TableRow.vue'
import Badge from '@/components/ui/Badge.vue'
import { humanDuration } from '@/utils'

export default {
  components: {
    ProgressBar,
    PerformanceStatusBadge,
    TableRowItem,
    TableHeadItem,
    PaginatedTable,
    TableRow,
    Badge,
  },
  props: {
    production: {
      required: true,
      type: Object,
    },
    performancesData: {
      required: true,
      type: [Array, Object],
    },
    performancesOffset: {
      required: true,
      type: Number,
    },
    loading: {
      default: false,
      type: Boolean,
    },
  },
  computed: {},
  methods: {
    salesPercentage(performance) {
      return Math.floor(
        (100 * performance.ticketsBreakdown.totalTicketsSold) /
          performance.ticketsBreakdown.totalCapacity
      )
    },
    humanDuration,
  },
}
</script>
