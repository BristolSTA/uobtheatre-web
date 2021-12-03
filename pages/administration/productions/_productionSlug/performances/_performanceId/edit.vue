<template>
  <admin-page title="Edit Performance">
    <template #toolbar>
      <sta-button colour="green" icon="save" @click="save">Save</sta-button>
      <sta-button colour="orange" to="../../">Cancel</sta-button>
    </template>
    <performance-editor
      ref="editor"
      :performance="performance"
      :errors="errors"
      v-bind.sync="performance"
    />
  </admin-page>
</template>

<script>
import AdminPerformanceDetailQuery from '@/graphql/queries/admin/productions/AdminPerformanceDetail.gql'
import PerformanceEditor from '@/components/performance/editor/PerformanceEditor.vue'
import AdminPage from '@/components/admin/AdminPage.vue'
import StaButton from '@/components/ui/StaButton.vue'
import {
  getValidationErrors,
  loadingSwal,
  performMutation,
  successToast,
} from '@/utils'
import Swal from 'sweetalert2'
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
      errors: null,
    }
  },
  methods: {
    async save() {
      this.errors = null
      loadingSwal.fire()
      try {
        await performMutation(
          this.$apollo,
          {
            mutation: require('@/graphql/mutations/admin/performance/PerformanceMutation.gql'),
            variables: {
              input: await this.$refs.editor.getInputData(),
            },
          },
          'performance'
        )
        const { data } = await this.$apollo.query({
          query: AdminPerformanceDetailQuery,
          variables: {
            productionSlug: this.$route.params.productionSlug,
            performanceId: this.performance.id,
          },
        })
        this.performance = data.production.performances.edges[0].node
        successToast.fire({ title: 'Performance Updated' })
      } catch (e) {
        this.errors = getValidationErrors(e)
        Swal.close()
      }
    },
  },
}
</script>
