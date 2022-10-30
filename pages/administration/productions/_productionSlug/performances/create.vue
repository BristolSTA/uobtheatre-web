<template>
  <admin-page title="Create a performance">
    <template #toolbar>
      <sta-button colour="green" icon="save" @click="create">
        Create
      </sta-button>
      <sta-button colour="orange" to="../../"> Cancel </sta-button>
    </template>
    <non-field-error :errors="errors" />
    <performance-editor
      ref="editor"
      :performance="performance"
      :production="production"
      v-model:errors="errors"
      v-bind.sync="performance"
    />
  </admin-page>
</template>

<script>
import Swal from 'sweetalert2';
import AdminPage from '@/components/admin/AdminPage.vue';
import PerformanceEditor from '@/components/performance/editor/PerformanceEditor.vue';
import StaButton from '@/components/ui/StaButton.vue';
import NonFieldError from '~~/components/ui/UiNonFieldError.vue';
import {
  AdminProductionLookupDocument,
  PerformanceMutationDocument
} from '@/graphql/codegen/operations';

import { getValidationErrors, performMutation } from '~~/utils/api';
import { loadingSwal, successToast, errorToast } from '~~/utils/alerts';
export default {
  components: { AdminPage, PerformanceEditor, StaButton, NonFieldError },
  async asyncData({ params, error, app }) {
    // Execute query
    const { data } = await app.apolloProvider.defaultClient.query({
      query: AdminProductionLookupDocument,
      variables: {
        slug: params.productionSlug
      }
    });

    const production = data.production;
    if (!production) {
      return error({
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
      performance: {},
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
          return this.$router.push(`${this.performance.id}/edit`);
        }
        successToast.fire({ title: 'Performance Created' });
        return this.$router.push(`../performances/${this.performance.id}`);
      } catch (e) {
        this.errors = getValidationErrors(e);
        Swal.close();
      }
    }
  }
};
</script>
