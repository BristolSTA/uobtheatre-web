<template>
  <div
    v-if="errors && errors.hasNonFieldErrors()"
    class="text-sm font-semibold text-sta-rouge"
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
      type: Errors,
    },
  },
}
</script>
