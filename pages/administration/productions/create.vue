<template>
  <AdminPage title="Create a Production">
    <template #toolbar>
      <UiStaButton colour="green" @click="create"> Create Draft </UiStaButton>
      <UiStaButton colour="orange" @click="useRouter().go(-1)">
        Cancel
      </UiStaButton>
    </template>
    <UiNonFieldError :errors="errors" />
    <production-editor ref="editor" :production="production" :errors="errors" />
    <div class="pt-4 flex items-center justify-center">
      <div class="rounded-lg bg-sta-gray-lighter p-3">
        NB: Performances can be created after you have started the draft
        production
      </div>
    </div>
  </AdminPage>
</template>

<script>
import Swal from 'sweetalert2';
import ProductionEditor from '@/components/production/editor/ProductionEditor.vue';

import { getValidationErrors, performMutation } from '~~/utils/api';
import { loadingSwal, successToast } from '~~/utils/alerts';
import { ProductionMutationDocument } from '~~/graphql/codegen/operations';

export default defineNuxtComponent({
  components: {
    ProductionEditor
  },
  data() {
    return {
      production: {},
      errors: null
    };
  },
  async mounted() {
    this.production = await this.$refs.editor.getInputData();
  },
  methods: {
    async create() {
      this.errors = null;
      loadingSwal.fire();
      try {
        const data = await performMutation(
          this.$apollo,
          {
            mutation: ProductionMutationDocument,
            variables: {
              input: await this.$refs.editor.getInputData()
            }
          },
          'production'
        );
        successToast.fire({ title: 'Production Created' });
        useRouter().push(`${data.production.production.slug}`);
      } catch (e) {
        this.errors = getValidationErrors(e);
      }
      Swal.close();
    }
  }
});
</script>
