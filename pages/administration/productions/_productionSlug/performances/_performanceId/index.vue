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
        :to="`/production/${production.slug}`"
        >Goto Box Office</sta-button
      >
      <sta-button colour="orange" icon="edit" :to="`${performance.id}/edit`"
        >Edit</sta-button
      >
    </template>
    <div class="flex space-x-2">
      <card title="Summary" class="max-w-2xl">
        <table class="w-full table-auto">
          <tr>
            <table-head-item :text-left="false">Status</table-head-item>
            <table-row-item>
              <performance-status-badge :performance="performance" />
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
      <card title="Sales">
        <table class="w-full table-auto">
          <tr>
            <table-head-item :text-left="false">Paid Bookings</table-head-item>
            <table-row-item>100</table-row-item>
          </tr>
          <tr>
            <table-head-item :text-left="false">Ticket Sales</table-head-item>
            <table-row-item>
              150 tickets sold (of 350 performance capacity)
              <progress-bar :percentage="75" />
            </table-row-item>
          </tr>
          <tr>
            <table-head-item :text-left="false"
              >Performance Sales Total</table-head-item
            >
            <table-row-item>£10.20</table-row-item>
          </tr>
        </table>
      </card>
    </div>
    <div class="mt-6">
      <h2 class="text-h2">Tools</h2>
      <div class="grid grid-cols-2 gap-6 md:grid-cols-5">
        <menu-tile
          class="bg-sta-green hover:bg-sta-green-dark"
          icon="clipboard-list"
          :to="`../bookings?performanceId=${performance.id}`"
          >View Bookings</menu-tile
        >
        <menu-tile
          class="bg-sta-green hover:bg-sta-green-dark"
          :to="`../bookings/create?performanceId=${performance.id}`"
          icon="plus-circle"
          >Create Comp Booking</menu-tile
        >
      </div>
    </div>
  </admin-page>
</template>

<script>
import AdminPerformanceDetailQuery from '@/graphql/queries/admin/AdminPerformanceDetail.gql'
import Card from '@/components/ui/Card.vue'
import AdminPage from '@/components/admin/AdminPage.vue'
import StaButton from '@/components/ui/StaButton.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import TableHeadItem from '@/components/ui/Tables/TableHeadItem.vue'
import TableRowItem from '@/components/ui/Tables/TableRowItem.vue'
import MenuTile from '@/components/ui/MenuTile.vue'
import PerformanceStatusBadge from '@/components/performance/PerformanceStatusBadge.vue'
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
  },
  async asyncData({ params, error, app }) {
    // Execute query
    const { data } = await app.apolloProvider.defaultClient.query({
      query: AdminPerformanceDetailQuery,
      variables: {
        productionSlug: params.productionSlug,
        performanceId: params.performanceId,
      },
    })

    const production = data.production
    if (!production || !production.performances.edges.length)
      return error({
        statusCode: 404,
      })
    return {
      performance: production.performances.edges[0].node,
      production,
    }
  },
  data() {
    return {
      production: null,
      performance: null,
    }
  },
}
</script>
