<template>
  <div class="container mx-auto">
    <h1 class="text-h1">Create a production</h1>
    <hr />
    <h2 class="text-h2">Basic Details</h2>
    <form-label>
      Name
      <t-input v-model="production.name" />
    </form-label>

    <hr />
  </div>
</template>

<script>
import FormLabel from '@/components/ui/FormLabel.vue'
import FakeProduction from '@/tests/unit/fixtures/Production'
export default {
  components: { FormLabel },
  data() {
    return {
      production: FakeProduction({}, true),
    }
  },
}
</script>
