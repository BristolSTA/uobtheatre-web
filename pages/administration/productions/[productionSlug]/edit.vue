<template>
  <AdminPage :title="`Edit ${production.name}`">
    <template #toolbar>
      <UiStaButton colour="green" @click="save"> Save Changes </UiStaButton>
      <UiStaButton colour="orange" @click="useRouter().go(-1)">
        Cancel
      </UiStaButton>
    </template>
    <UiNonFieldError :errors="errors" />
    <production-editor ref="editor" :production="production" :errors="errors" />
  </AdminPage>
</template>

<script>
import Swal from 'sweetalert2';
import AdminProductionEditQuery from '@/graphql/queries/admin/productions/AdminProductionEdit.gql';
import ProductionEditor from '@/components/production/editor/ProductionEditor.vue';

import { getValidationErrors, performMutation } from '~~/utils/api';
import { loadingSwal, successToast } from '~~/utils/alerts';
import { ProductionMutationDocument } from '~~/graphql/codegen/operations';

export default defineNuxtComponent({
  components: { ProductionEditor },
  async asyncData() {
    // Execute query
    const { data } = await useDefaultApolloClient().query({
      query: AdminProductionEditQuery,
      variables: {
        slug: useRoute().params.productionSlug
      },
      fetchPolicy: 'no-cache'
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
      production: null,
      errors: null
    };
  },
  methods: {
    async save() {
      this.errors = null;
      loadingSwal.fire();
      try {
        await performMutation(
          this.$apollo,
          {
            mutation: ProductionMutationDocument,
            variables: {
              input: await this.$refs.editor.getInputData()
            }
          },
          'production'
        );
        const { data } = await this.$apollo.query({
          query: AdminProductionEditQuery,
          variables: {
            slug: this.production.slug
          }
        });
        this.production = data.production;
        useRouter().replace(
          `/administration/productions/${this.production.slug}`
        );
        successToast.fire({ title: 'Production Updated' });
      } catch (e) {
        this.errors = getValidationErrors(e);
        Swal.close();
      }
    }
  }
});
</script>
