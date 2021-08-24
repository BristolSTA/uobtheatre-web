<template>
  <admin-page :title="production.name">
    <template #toolbar>
      <sta-button
        colour="orange"
        icon="link"
        :to="`/production/${production.slug}`"
        >View Public Page</sta-button
      >
      <sta-button colour="rouge" icon="edit" :to="`${production.slug}/edit`"
        >Edit</sta-button
      >
    </template>
    <div class="space-y-4">
      <card title="Summary" class="max-w-2xl">
        <table class="w-full table-auto">
          <tr>
            <th>Status</th>
            <td>
              <badge class="bg-sta-green">Published</badge>
              <p class="text-sm">
                This production is shown publically, and available for booking
              </p>
            </td>
          </tr>
          <tr>
            <th>Ticket Sales</th>
            <td>
              150 tickets sold (of 350 cross-show capacity)
              <progress-bar :percentage="75" />
            </td>
          </tr>
          <tr>
            <th>Sales Total</th>
            <td>£1020.20</td>
          </tr>
        </table>
      </card>
      <card title="Performances">
        <table class="w-full table-auto">
          <thead>
            <tr>
              <th></th>
              <th>Date</th>
              <th>Doors Time</th>
              <th>Venue</th>
              <th>Sales</th>
              <th></th>
            </tr>
          </thead>
          <tbody class="text-center border rounded-lg broder-sta-gray">
            <tr
              v-for="performance in production.performances.edges.map(
                (edge) => edge.node
              )"
              :key="performance.id"
              class="even:bg-sta-gray-light odd:bg-sta-gray-dark"
            >
              <td>
                <badge class="text-sm bg-sta-green">Bookable</badge>
              </td>
              <td>{{ performance.start | dateFormat('EEEE dd MMMM y') }}</td>
              <td>{{ performance.doorsOpen | dateFormat('HH:mm ZZZZ') }}</td>
              <td>{{ performance.venue.name }}</td>
              <td>
                <p>208 of 380</p>
                <progress-bar :height="2" :percentage="80" />
              </td>
              <td class="space-x-2">
                <sta-button
                  :small="true"
                  colour="green"
                  :to="`${production.slug}/performances/${performance.id}`"
                  >View</sta-button
                >
              </td>
            </tr>
          </tbody>
        </table>
      </card>
    </div>
  </admin-page>
</template>

<script>
import AdminProductionShowQuery from '@/graphql/queries/admin/AdminProductionShow.gql'
import AdminPage from '@/components/admin/AdminPage.vue'
import StaButton from '@/components/ui/StaButton.vue'
import Card from '@/components/ui/Card.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import Badge from '@/components/ui/Badge.vue'
export default {
  components: { AdminPage, StaButton, Card, ProgressBar, Badge },
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
    }
  },
  head() {
    const productionName = this.production ? this.production.name : 'Loading...'
    return {
      title: productionName,
    }
  },
}
</script>
