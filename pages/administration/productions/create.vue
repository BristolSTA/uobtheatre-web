<template>
  <div>
    <h1 class="text-h1">Create a production</h1>
    <production-editor :production="production" />
  </div>
</template>

<script>
import FakeProduction from '@/tests/unit/fixtures/Production'
import ProductionEditor from '@/components/production/ProductionEditor.vue'
export default {
  components: {
    ProductionEditor,
  },
  data() {
    return { production: FakeProduction({}, true) }
  },
}
</script>
