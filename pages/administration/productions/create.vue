<template>
  <admin-page title="Create a Production">
    <template #toolbar>
      <sta-button colour="green" @click="create"> Create Draft </sta-button>
      <sta-button colour="orange" @click="$router.go(-1)"> Cancel </sta-button>
    </template>
    <non-field-error :errors="errors" />
    <production-editor
      ref="editor"
      :production="production"
      v-bind.sync="production"
      :errors="errors"
    />
    <div class="pt-4 flex items-center justify-center">
      <div class="rounded-lg bg-sta-gray-lighter p-3">
        NB: Performances can be created after you have started the draft
        production
      </div>
    </div>
  </admin-page>
</template>

<script>
import Swal from 'sweetalert2';
import ProductionEditor from '@/components/production/editor/ProductionEditor.vue';
import AdminPage from '@/components/admin/AdminPage.vue';
import StaButton from '@/components/ui/StaButton.vue';
import NonFieldError from '~~/components/ui/UiNonFieldError.vue';
import { getValidationErrors, performMutation } from '~~/utils/api';
import { loadingSwal, successToast } from '~~/utils/alerts';
import { ProductionMutationDocument } from '~~/graphql/codegen/operations';
export default defineNuxtComponent({
  components: {
    ProductionEditor,
    AdminPage,
    StaButton,
    NonFieldError
  },
  data() {
    return {
      production: null,
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
        this.$router.push(`${data.production.production.slug}`);
      } catch (e) {
        this.errors = getValidationErrors(e);
      }
      Swal.close();
    }
  }
});
</script>
