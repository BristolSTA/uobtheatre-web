<template>
  <div>
    <h1 class="text-h1">{{ production.name }}</h1>
  </div>
</template>

<script>
import AdminProductionShowQuery from '@/graphql/queries/admin/AdminProductionShow.gql'
export default {
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
        message: 'This production does not exists',
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
      title: `${productionName}`,
    }
  },
}
</script>
