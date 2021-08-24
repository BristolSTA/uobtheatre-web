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
    </template>
    <div class="flex space-x-2">
      <card title="Summary" class="max-w-2xl">
        <table class="w-full table-auto">
          <tr>
            <th>Status</th>
            <td>
              <badge class="bg-sta-green">Bookable</badge>
              <p class="text-sm">This performance is available to book</p>
            </td>
          </tr>
          <tr>
            <th>Doors Open</th>
            <td>
              {{ performance.doorsOpen | dateFormat('dd MM y T ZZZZ') }}
            </td>
          </tr>
          <tr>
            <th>Starts</th>
            <td>
              {{ performance.start | dateFormat('dd MM y T ZZZZ') }}
            </td>
          </tr>
          <tr>
            <th>Ends</th>
            <td>
              {{ performance.end | dateFormat('dd MM y T ZZZZ') }}
            </td>
          </tr>
        </table>
      </card>
      <card title="Sales">
        <table class="w-full table-auto">
          <tr>
            <th>Paid Bookings</th>
            <td>100</td>
          </tr>
          <tr>
            <th>Ticket Sales</th>
            <td>
              150 tickets sold (of 350 performance capacity)
              <progress-bar :percentage="75" />
            </td>
          </tr>
          <tr>
            <th>Performance Sales Total</th>
            <td>£10.20</td>
          </tr>
        </table>
      </card>
    </div>
  </admin-page>
</template>

<script>
import AdminPerformanceDetailQuery from '@/graphql/queries/admin/AdminPerformanceDetail.gql'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import AdminPage from '@/components/admin/AdminPage.vue'
import StaButton from '@/components/ui/StaButton.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
export default {
  components: { Card, Badge, AdminPage, StaButton, ProgressBar },
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
