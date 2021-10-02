<template>
  <admin-page title="Edit Performance">
    <template #toolbar>
      <sta-button colour="green" icon="save">Save</sta-button>
      <sta-button colour="orange" to="../../">Cancel</sta-button>
    </template>
    <performance-editor :performance="performance" />
  </admin-page>
</template>

<script>
import AdminPerformanceDetailQuery from '@/graphql/queries/admin/productions/AdminPerformanceDetail.gql'
import PerformanceEditor from '@/components/performance/editor/PerformanceEditor.vue'
import AdminPage from '@/components/admin/AdminPage.vue'
import StaButton from '@/components/ui/StaButton.vue'
export default {
  components: { PerformanceEditor, AdminPage, StaButton },
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
    return {
      performance: production.performances.edges[0].node,
    }
  },
  data() {
    return {
      performance: null,
    }
  },
}
</script>
