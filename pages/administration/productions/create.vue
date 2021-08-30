<template>
  <admin-page title="Create a Production">
    <template #toolbar>
      <sta-button colour="green">Start Draft</sta-button>
      <sta-button colour="orange">Cancel</sta-button>
    </template>
    <production-editor :production="production" />
    <p>
      NB: Performances can be created after you have started the draft
      production
    </p>
  </admin-page>
</template>

<script>
import ProductionEditor from '@/components/production/editor/ProductionEditor.vue'
import AdminPage from '@/components/admin/AdminPage.vue'
import StaButton from '@/components/ui/StaButton.vue'
import FakeProduction from '@/tests/unit/fixtures/Production.js'
export default {
  components: {
    ProductionEditor,
    AdminPage,
    StaButton,
  },
  data() {
    return {
      production: {
        society: FakeProduction().society,
      },
    }
  },
}
</script>
