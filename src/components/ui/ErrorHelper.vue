<template>
  <span
    v-if="errors && errors.has(fieldName)"
    class="text-xs font-semibold text-sta-rouge"
  >
    {{ errors.first(fieldName).message }}
  </span>
</template>

<script>
import Errors from '@/classes/Errors';
export default {
  props: {
    errors: {
      required: false,
      default: null,
      type: Errors,
    },
    fieldName: {
      required: true,
      type: String,
    },
  },
};
</script>