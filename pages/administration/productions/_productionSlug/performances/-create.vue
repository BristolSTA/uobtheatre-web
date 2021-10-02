<template>
  <admin-page title="Create a performance">
    <template #toolbar>
      <sta-button colour="green" icon="save">Create</sta-button>
      <sta-button colour="orange" to="../../">Cancel</sta-button>
    </template>
    <performance-editor :performance="performance" />
  </admin-page>
</template>

<script>
import AdminPage from '@/components/admin/AdminPage.vue'
import PerformanceEditor from '@/components/performance/editor/PerformanceEditor.vue'
import StaButton from '@/components/ui/StaButton.vue'
export default {
  components: { AdminPage, PerformanceEditor, StaButton },
  data() {
    return {
      performance: {},
    }
  },
}
</script>
