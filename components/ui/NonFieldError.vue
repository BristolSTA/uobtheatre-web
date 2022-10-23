<template>
  <div
    v-if="errors && errors.hasNonFieldErrors()"
    class="text-sta-rouge text-sm font-semibold"
  >
    <p>Error: {{ errors.nonFieldErrors[0].message }}</p>
  </div>
</template>

<script>
import Errors from '@/classes/Errors'
export default {
  name: 'NonFieldError',
  props: {
    errors: {
      required: false,
      default: null,
      type: Errors
    }
  }
}
</script>
