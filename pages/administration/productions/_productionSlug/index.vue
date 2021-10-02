<template>
  <admin-page :title="production.name">
    <template #toolbar>
      <sta-button
        colour="orange"
        icon="link"
        :to="`/production/${production.slug}`"
        >View Public Page</sta-button
      >
      <!-- <sta-button colour="rouge" icon="edit" :to="`${production.slug}/edit`"
        >Edit</sta-button
      > -->
    </template>
    <div class="space-y-4">
      <div class="flex flex-wrap justify-around space-y-4">
        <card title="Summary" class="max-w-2xl">
          <table class="w-full table-auto">
            <tr>
              <table-head-item>Status</table-head-item>
              <table-row-item>
                <production-status-badge :production="production" />
                <p class="text-sm">{{ statusDescription }}</p>
              </table-row-item>
            </tr>
            <tr>
              <table-head-item>Society</table-head-item>
              <table-row-item>
                <p class="text-sm">{{ production.society.name }}</p>
              </table-row-item>
            </tr>
            <tr>
              <table-head-item>Ticket Sales</table-head-item>
              <table-row-item>
                {{ production.totalTicketsSold }} tickets sold (of
                {{ production.totalCapacity }} cross-show capacity)
                <progress-bar
                  :percentage="
                    (100 * production.totalTicketsSold) /
                    production.totalCapacity
                  "
                />
              </table-row-item>
            </tr>
            <tr>
              <table-head-item>Sales Total</table-head-item>
              <table-row-item
                >£{{
                  (production.salesBreakdown.totalSales / 100).toFixed(2)
                }}</table-row-item
              >
            </tr>
            <tr>
              <table-head-item>Total Society Revenue</table-head-item>
              <table-row-item
                >£{{
                  (production.salesBreakdown.societyRevenue / 100).toFixed(2)
                }}</table-row-item
              >
            </tr>
          </table>
        </card>
        <div class="flex flex-col items-center px-6 space-y-5">
          <menu-tile
            icon="clipboard-list"
            class="bg-sta-green hover:bg-sta-green-dark"
            :to="`${production.slug}/bookings`"
            >View Bookings</menu-tile
          >
          <!-- <menu-tile
            v-if="production.status.value === 'DRAFT'"
            class="bg-sta-orange hover:bg-sta-orange-dark"
            icon="user-check"
            >Submit for Review TODO</menu-tile
          > -->
        </div>
      </div>
      <card title="Performances">
        <template #messageBox>
          <nuxt-link
            class="hover:text-gray-200"
            :to="`${production.slug}/performances/create`"
            ><font-awesome-icon icon="plus-circle" class="fa-2x"
          /></nuxt-link>
        </template>
        <paginated-table
          :items="
            performancesData
              ? performancesData.edges.map((edge) => edge.node)
              : []
          "
          :loading="$apollo.queries.performancesData.loading"
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
            <table-row
              v-for="performance in slotProps.items"
              :key="performance.id"
            >
              <table-row-item>
                <performance-status-badge :performance="performance" />
              </table-row-item>
              <table-row-item>{{
                performance.start | dateFormat('EEEE dd MMMM y')
              }}</table-row-item>
              <table-row-item>{{
                performance.doorsOpen | dateFormat('HH:mm ZZZZ')
              }}</table-row-item>
              <table-row-item>{{ performance.venue.name }}</table-row-item>
              <table-row-item>
                <p>
                  {{ performance.ticketsBreakdown.totalTicketsSold }} of
                  {{ performance.ticketsBreakdown.totalCapacity }}
                </p>
                <progress-bar
                  :height="2"
                  :percentage="
                    (100 * performance.ticketsBreakdown.totalTicketsSold) /
                    performance.ticketsBreakdown.totalCapacity
                  "
                />
              </table-row-item>
              <table-row-item class="space-x-2">
                <sta-button
                  :small="true"
                  colour="green"
                  :to="`${production.slug}/performances/${performance.id}`"
                  >View</sta-button
                >
              </table-row-item>
            </table-row>
          </template>
        </paginated-table>
      </card>
    </div>
  </admin-page>
</template>

<script>
import AdminProductionShowQuery from '@/graphql/queries/admin/productions/AdminProductionShow.gql'
import AdminPerformancesIndexQuery from '@/graphql/queries/admin/productions/AdminPerformancesIndex.gql'
import AdminPage from '@/components/admin/AdminPage.vue'
import StaButton from '@/components/ui/StaButton.vue'
import Card from '@/components/ui/Card.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import MenuTile from '@/components/ui/MenuTile.vue'
import PerformanceStatusBadge from '@/components/performance/PerformanceStatusBadge.vue'
import TableRowItem from '@/components/ui/Tables/TableRowItem.vue'
import TableHeadItem from '@/components/ui/Tables/TableHeadItem.vue'
import ProductionStatusBadge from '@/components/production/ProductionStatusBadge.vue'
import PaginatedTable from '@/components/ui/Tables/PaginatedTable.vue'
import TableRow from '@/components/ui/Tables/TableRow.vue'
export default {
  components: {
    AdminPage,
    StaButton,
    Card,
    ProgressBar,
    MenuTile,
    PerformanceStatusBadge,
    TableRowItem,
    TableHeadItem,
    ProductionStatusBadge,
    PaginatedTable,
    TableRow,
  },
  async asyncData({ params, error, app }) {
    // Execute query
    const { data } = await app.apolloProvider.defaultClient.query({
      query: AdminProductionShowQuery,
      variables: {
        slug: params.productionSlug,
      },
    })

    const production = data.production
    if (!production)
      return error({
        statusCode: 404,
        message: 'This production does not exist',
      })
    return {
      production,
    }
  },
  data() {
    return {
      production: null,

      performancesData: null,
      performancesOffset: 0,
    }
  },
  apollo: {
    performancesData: {
      query: AdminPerformancesIndexQuery,
      variables() {
        return {
          productionSlug: this.production.slug,
          offset: this.performancesOffset,
        }
      },
      update: (data) => data.production.performances,
    },
  },
  head() {
    const productionName = this.production ? this.production.name : 'Loading...'
    return {
      title: productionName,
    }
  },
  computed: {
    statusDescription() {
      if (this.production.status.description === 'Draft')
        return 'This production is private, and not bookable'
      if (this.production.status.description === 'Submitted')
        return 'This production has been submitted for review'
      if (this.production.status.description === 'Published')
        return 'This production is being displayed publically'
      if (this.production.status.description === 'Closed')
        return 'This production has been closed, and it no longer accepting bookings'
      if (this.production.status.description === 'Complete')
        return 'This production has been completed, and income has been transfered to the society'

      return null
    },
  },
}
</script>
