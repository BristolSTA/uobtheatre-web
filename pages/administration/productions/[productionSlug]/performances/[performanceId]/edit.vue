<template>
  <AdminPage title="Edit Performance">
    <template #toolbar>
      <UiStaButton colour="green" icon="save" @click="save"> Save </UiStaButton>
      <UiStaButton colour="orange" to="../../"> Cancel </UiStaButton>
    </template>
    <UiNonFieldError :errors="errors" />
    <performance-editor
      ref="editor"
      v-model:errors="errors"
      :performance="performance"
      :production="production"
    />
  </AdminPage>
</template>

<script>
import Swal from 'sweetalert2';
import AdminPerformanceDetailQuery from '@/graphql/queries/admin/productions/AdminPerformanceDetail.gql';
import PerformanceEditor from '@/components/performance/editor/PerformanceEditor.vue';

import { getValidationErrors, performMutation } from '~~/utils/api';
import { loadingSwal, successToast, errorToast } from '~~/utils/alerts';
import { PerformanceMutationDocument } from '~~/graphql/codegen/operations';

export default defineNuxtComponent({
  components: { PerformanceEditor },
  async asyncData() {
    // Execute query
    const { data } = await useDefaultApolloClient().query({
      query: AdminPerformanceDetailQuery,
      variables: {
        productionSlug: useRoute().params.productionSlug,
        performanceId: useRoute().params.performanceId
      },
      fetchPolicy: 'no-cache'
    });

    const production = data.production;
    if (!production || !production.performances.edges.length) {
      throw createError({
        statusCode: 404
      });
    }
    return {
      performance: production.performances.edges[0].node,
      production
    };
  },
  data() {
    return {
      performance: null,
      production: null,
      errors: null
    };
  },
  methods: {
    async save() {
      this.errors = null;
      loadingSwal.fire();
      try {
        const saveResult = await this.$refs.editor.saveRelated();
        await performMutation(
          this.$apollo,
          {
            mutation: PerformanceMutationDocument,
            variables: {
              input: await this.$refs.editor.getInputData()
            }
          },
          'performance'
        );

        const { data } = await this.$apollo.query({
          query: AdminPerformanceDetailQuery,
          variables: {
            productionSlug: this.$route.params.productionSlug,
            performanceId: this.performance.id
          }
        });
        this.performance = data.production.performances.edges[0].node;
        if (saveResult) {
          successToast.fire({ title: 'Performance Updated' });
          return this.$router.push(
            `/administration/productions/${this.production.slug}/performances/${this.performance.id}`
          );
        }
        errorToast.fire({ title: 'Performance saved but with errors' });
      } catch (e) {
        this.errors = getValidationErrors(e);
        Swal.close();
      }
    }
  }
});
</script>
