<template>
  <admin-page :title="`Edit ${production.name}`">
    <production-editor :production="production" />
  </admin-page>
</template>

<script>
import AdminProductionEditQuery from '@/graphql/queries/admin/productions/AdminProductionEdit.gql'
import ProductionEditor from '@/components/production/editor/ProductionEditor.vue'
import AdminPage from '@/components/admin/AdminPage.vue'
export default {
  components: { ProductionEditor, AdminPage },
  async asyncData({ params, error, app }) {
    // Execute query
    const { data } = await app.apolloProvider.defaultClient.query({
      query: AdminProductionEditQuery,
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
    const title = this.production
      ? `Edit ${this.production.name}`
      : 'Loading...'
    return {
      title,
    }
  },
}
</script>
