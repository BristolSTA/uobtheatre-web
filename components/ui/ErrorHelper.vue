<template>
  <span
    v-if="errors && errors.has(fieldName)"
    class="text-sta-rouge text-xs font-semibold"
  >
    {{ errors.first(fieldName).message }}
  </span>
</template>

<script>
import Errors from '@/classes/Errors'
export default {
  props: {
    errors: {
      required: false,
      default: null,
      type: Errors
    },
    fieldName: {
      required: true,
      type: String
    }
  }
}
</script>
