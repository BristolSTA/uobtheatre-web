<template>
  <admin-page
    :title="`${production.name} at ${$options.filters.dateFormat(
      performance.start,
      'd MMM yy HH:mm ZZZZ'
    )}`"
  >
    <template #toolbar>
      <sta-button
        colour="green"
        icon="link"
        :to="`/box-office/${performance.id}`"
        >Goto Box Office</sta-button
      >
      <sta-button colour="orange" icon="edit" :to="`${performance.id}/edit`"
        >Edit</sta-button
      >
    </template>
    <div class="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
      <card title="Summary" class="max-w-2xl">
        <table class="table-auto w-full">
          <tr>
            <table-head-item :text-left="false">Status</table-head-item>
            <table-row-item>
              <performance-status-badge :performance="performance" />
            </table-row-item>
          </tr>
          <tr>
            <table-head-item :text-left="false">Venue</table-head-item>
            <table-row-item>
              {{ performance.venue.name }}
            </table-row-item>
          </tr>
          <tr>
            <table-head-item :text-left="false">Doors Open</table-head-item>
            <table-row-item>
              {{ performance.doorsOpen | dateFormat('dd MM y T ZZZZ') }}
            </table-row-item>
          </tr>
          <tr>
            <table-head-item :text-left="false">Starts</table-head-item>
            <table-row-item>
              {{ performance.start | dateFormat('dd MM y T ZZZZ') }}
            </table-row-item>
          </tr>
          <tr>
            <table-head-item :text-left="false">Ends</table-head-item>
            <table-row-item>
              {{ performance.end | dateFormat('dd MM y T ZZZZ') }}
            </table-row-item>
          </tr>
        </table>
      </card>
      <card
        v-if="performance.ticketsBreakdown.totalCapacity"
        title="Sales Overview"
      >
        <table class="table-auto w-full">
          <!-- <tr>
            <table-head-item :text-left="false">Paid Bookings</table-head-item>
            <table-row-item>100 TODO</table-row-item>
          </tr> -->
          <tr>
            <table-head-item :text-left="false">Ticket Sales</table-head-item>
            <table-row-item>
              {{ performance.ticketsBreakdown.totalTicketsSold }} tickets sold |
              {{
                (
                  (100 * performance.ticketsBreakdown.totalTicketsSold) /
                  performance.ticketsBreakdown.totalCapacity
                ).toFixed(0)
              }}%<br />
              <small
                >(of
                {{ performance.ticketsBreakdown.totalCapacity }} performance
                capacity)
              </small>
              <progress-bar
                :percentage="
                  Math.min(
                    100,
                    (100 * performance.ticketsBreakdown.totalTicketsSold) /
                      performance.ticketsBreakdown.totalCapacity
                  )
                "
              />
            </table-row-item>
          </tr>
          <tr v-if="performance.salesBreakdown">
            <table-head-item :text-left="false"
              >Performance Sales Total</table-head-item
            >
            <table-row-item
              >£{{
                (performance.salesBreakdown.totalSales / 100).toFixed(2)
              }}</table-row-item
            >
          </tr>
          <tr>
            <table-head-item :text-left="false"
              >Performance Society Revenue</table-head-item
            >
            <table-row-item
              >£{{
                (performance.salesBreakdown.societyRevenue / 100).toFixed(2)
              }}</table-row-item
            >
          </tr>
        </table>
      </card>
    </div>
    <card
      v-if="ticketsMatrix.ticketOptions.length"
      class="mt-4"
      title="Sales By Ticket"
    >
      <div class="flex flex-wrap justify-evenly space-x-6">
        <div>
          <table>
            <thead>
              <tr>
                <table-head-item :text-left="false">Seat Group</table-head-item>
                <table-head-item :text-left="false"
                  >No. Tickets</table-head-item
                >
                <table-head-item :text-left="false"
                  >Remaining Capacity</table-head-item
                >
              </tr>
            </thead>
            <tbody>
              <table-row
                v-for="(
                  performanceSeatGroup, index
                ) in ticketsMatrix.ticketOptions"
                :key="index"
                class="text-center"
              >
                <table-row-item>{{
                  performanceSeatGroup.seatGroup.name
                }}</table-row-item>
                <table-row-item>{{
                  performanceSeatGroup.capacity -
                  performanceSeatGroup.capacityRemaining
                }}</table-row-item>
                <table-row-item>{{
                  performanceSeatGroup.capacityRemaining
                }}</table-row-item>
              </table-row>
            </tbody>
          </table>
        </div>
        <!-- <div>
          <table>
            <thead>
              <tr>
                <table-head-item :text-left="false"
                  >Concession Type</table-head-item
                >
                <table-head-item :text-left="false"
                  >No. Tickets</table-head-item
                >
              </tr>
            </thead>
            <tbody>
              <table-row class="text-center">
                <table-row-item>TODO</table-row-item>
                <table-row-item>TODO</table-row-item>
              </table-row>
            </tbody>
          </table>
        </div> -->
      </div>
    </card>
    <div class="mt-6">
      <h2 class="text-h2">Tools</h2>
      <div
        class="
          grid
          gap-6
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
        "
      >
        <menu-tile
          class="bg-sta-green hover:bg-sta-green-dark"
          icon="clipboard-list"
          :to="`../bookings?performanceId=${performance.id}`"
          >View Bookings</menu-tile
        >
        <menu-tile
          class="bg-sta-green hover:bg-sta-green-dark"
          :to="`../bookings/create/${performance.id}`"
          icon="plus-circle"
          >Create Comp Booking</menu-tile
        >
        <menu-tile
          class="bg-sta-green hover:bg-sta-green-dark"
          icon="file-export"
          @click="downloadBookings"
          >Download Bookings</menu-tile
        >
      </div>
    </div>
  </admin-page>
</template>

<script>
import AdminPerformanceDetailQuery from '@/graphql/queries/admin/productions/AdminPerformanceDetail.gql'
import Card from '@/components/ui/Card.vue'
import AdminPage from '@/components/admin/AdminPage.vue'
import StaButton from '@/components/ui/StaButton.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import TableHeadItem from '@/components/ui/Tables/TableHeadItem.vue'
import TableRowItem from '@/components/ui/Tables/TableRowItem.vue'
import MenuTile from '@/components/ui/MenuTile.vue'
import PerformanceStatusBadge from '@/components/performance/PerformanceStatusBadge.vue'
import TicketsMatrix from '@/classes/TicketsMatrix'
import TableRow from '@/components/ui/Tables/TableRow.vue'
import { performMutation } from '@/utils'
export default {
  components: {
    Card,
    AdminPage,
    StaButton,
    ProgressBar,
    TableHeadItem,
    TableRowItem,
    MenuTile,
    PerformanceStatusBadge,
    TableRow,
  },
  async asyncData({ params, error, app }) {
    // Execute query
    const { data } = await app.apolloProvider.defaultClient.query({
      query: AdminPerformanceDetailQuery,
      variables: {
        productionSlug: params.productionSlug,
        performanceId: params.performanceId,
      },
      fetchPolicy: 'no-cache',
    })

    const production = data.production
    if (!production || !production.performances.edges.length)
      return error({
        statusCode: 404,
      })
    const performance = production.performances.edges[0].node
    return {
      performance,
      production,
      ticketsMatrix: new TicketsMatrix(performance),
    }
  },
  data() {
    return {
      production: null,
      performance: null,
      ticketsMatrix: null,
    }
  },
  head() {
    const title = `Performance of ${this.production.name}`
    return { title }
  },
  methods: {
    async downloadBookings() {
      const data = await performMutation(
        this.$apollo,
        {
          mutation: require('@/graphql/mutations/admin/GenerateReport.gql'),
          variables: {
            name: 'PerformanceBookings',
            options: [{ name: 'id', value: this.performance.id }],
          },
        },
        'generateReport'
      )

      window.open(data.generateReport.downloadUri)
    },
  },
}
</script>
