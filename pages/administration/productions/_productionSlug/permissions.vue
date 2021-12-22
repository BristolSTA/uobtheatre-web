<template>
  <admin-page title="Edit Permissions">
    <permissions-assigner
      :assignable-permissions="production.assignablePermissions"
      :assigned-users="production.assignedUsers"
    />
  </admin-page>
</template>

<script>
import AdminPage from '@/components/admin/AdminPage.vue'
import PermissionsAssigner from '@/components/admin/permissions/PermissionsAssigner.vue'
export default {
  components: { AdminPage, PermissionsAssigner },
  async asyncData({ params, error, app }) {
    // Execute query
    const { data } = await app.apolloProvider.defaultClient.query({
      query: require('@/graphql/queries/admin/productions/AdminProductionPermissions.gql'),
      variables: {
        slug: params.productionSlug,
      },
      fetchPolicy: 'no-cache',
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
}
</script>
