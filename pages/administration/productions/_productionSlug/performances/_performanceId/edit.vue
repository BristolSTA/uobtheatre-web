<template>
  <admin-page title="Edit Performance">
    <template #toolbar>
      <sta-button colour="green" icon="save" @click="save"> Save </sta-button>
      <sta-button colour="orange" to="../../"> Cancel </sta-button>
    </template>
    <non-field-error :errors="errors" />
    <performance-editor
      ref="editor"
      :performance="performance"
      :production="production"
      :errors.sync="errors"
      v-bind.sync="performance"
    />
  </admin-page>
</template>

<script>
import Swal from "sweetalert2";
import AdminPerformanceDetailQuery from "@/graphql/queries/admin/productions/AdminPerformanceDetail.gql";
import PerformanceEditor from "@/components/performance/editor/PerformanceEditor.vue";
import AdminPage from "@/components/admin/AdminPage.vue";
import StaButton from "@/components/ui/StaButton.vue";
import {
  errorToast,
  getValidationErrors,
  loadingSwal,
  performMutation,
  successToast,
} from "@/utils";
import NonFieldError from "@/components/ui/NonFieldError.vue";
export default {
  components: { PerformanceEditor, AdminPage, StaButton, NonFieldError },
  async asyncData({ params, error, app }) {
    // Execute query
    const { data } = await app.apolloProvider.defaultClient.query({
      query: AdminPerformanceDetailQuery,
      variables: {
        productionSlug: params.productionSlug,
        performanceId: params.performanceId,
      },
      fetchPolicy: "no-cache",
    });

    const production = data.production;
    if (!production || !production.performances.edges.length) {
      return error({
        statusCode: 404,
      });
    }
    return {
      performance: production.performances.edges[0].node,
      production,
    };
  },
  data() {
    return {
      performance: null,
      production: null,
      errors: null,
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
            mutation: require("@/graphql/mutations/admin/performance/PerformanceMutation.gql"),
            variables: {
              input: await this.$refs.editor.getInputData(),
            },
          },
          "performance"
        );
        const { data } = await this.$apollo.query({
          query: AdminPerformanceDetailQuery,
          variables: {
            productionSlug: this.$route.params.productionSlug,
            performanceId: this.performance.id,
          },
        });
        this.performance = data.production.performances.edges[0].node;
        if (saveResult) {
          successToast.fire({ title: "Performance Updated" });
          return this.$router.push(
            `/administration/productions/${this.production.slug}/performances/${this.performance.id}`
          );
        }
        errorToast.fire({ title: "Performance saved but with errors" });
      } catch (e) {
        this.errors = getValidationErrors(e);
        Swal.close();
      }
    },
  },
};
</script>
