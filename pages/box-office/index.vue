<template>
  <div class="sm:container">
    <div class="sm:py-10">
      <overview
        :production="production"
        :performance="production.performances.edges[0].node"
      />
    </div>
  </div>
</template>

<script>
import ProductionPageQuery from '@/graphql/queries/ProductionBySlug.gql'
import Overview from '@/components/box-office/Overview.vue'

export default {
  name: 'BoxOffice',
  components: { Overview },
  async asyncData({ params, error, app }) {
    // Execute query
    const { data } = await app.apolloProvider.defaultClient.query({
      query: ProductionPageQuery,
      variables: {
        slug: 'legally-blonde',
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
  // data() {
  //   return {
  //     productions: null,
  //   }
  // },
}
</script>
