<template>
  <div
    v-if="errors && errors.any()"
    class="text-sm font-semibold text-sta-rouge"
  >
    <h4 class="text-h4">Whoops. There were some errors:</h4>
    <ul class="list-disc list-inside">
      <li v-for="(error, index) in errors.allErrors" :key="index">
        {{ error.message }}
      </li>
    </ul>
  </div>
</template>

<script>
import Errors from '@/classes/Errors'
export default {
  props: {
    errors: {
      required: false,
      default: null,
      type: Errors,
    },
  },
}
</script>
