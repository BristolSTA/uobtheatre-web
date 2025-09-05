<template>
  <AdminPage title="Create a performance">
    <template #toolbar>
      <UiStaButton colour="green" icon="save" @click="create">
        Create
      </UiStaButton>
      <UiStaButton colour="orange" to="../"> Cancel </UiStaButton>
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

import PerformanceEditor from '@/components/performance/editor/PerformanceEditor.vue';

import {
  AdminProductionLookupDocument,
  PerformanceMutationDocument
} from '@/graphql/codegen/operations';

import { getValidationErrors, performMutation } from '~~/utils/api';
import { loadingSwal, successToast, errorToast } from '~~/utils/alerts';

export default defineNuxtComponent({
  components: { PerformanceEditor },
  async asyncData() {
    // Execute query
    const { data } = await useDefaultApolloClient().query({
      query: AdminProductionLookupDocument,
      variables: {
        slug: useRoute().params.productionSlug
      }
    });

    const production = data.production;
    if (!production) {
      throw createSafeError({
        statusCode: 404,
        message: 'This production does not exist'
      });
    }
    return {
      production
    };
  },
  data() {
    return {
      performance: {
        ticketOptions: []
      },
      production: null,
      errors: null
    };
  },
  mounted() {
    this.performance = { discounts: {}, ...this.$refs.editor.getInputData() };
  },
  methods: {
    async create() {
      this.errors = null;
      loadingSwal.fire();
      try {
        const data = await performMutation(
          this.$apollo,
          {
            mutation: PerformanceMutationDocument,
            variables: {
              input: {
                ...this.$refs.editor.getInputData(),
                production: this.production.id
              }
            }
          },
          'performance'
        );

        this.performance.id = data.performance.performance.id;

        if (!(await this.$refs.editor.saveRelated())) {
          errorToast.fire({
            title:
              'Performance created, but there was an issue creating the related objects'
          });
          return useRouter().push(`${this.performance.id}/edit`);
        }
        successToast.fire({ title: 'Performance Created' });
        return useRouter().push(`../performances/${this.performance.id}`);
      } catch (e) {
        this.errors = getValidationErrors(e);
        Swal.close();
      }
    }
  }
});
</script>
