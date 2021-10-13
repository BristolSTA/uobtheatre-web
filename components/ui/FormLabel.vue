<template>
  <div>
    <label>
      <span class="text-white text-xs font-semibold"><slot></slot></span>
      <p v-if="$slots.helper" class="text-gray-400 text-sm">
        <slot name="helper"></slot>
      </p>
    </label>
    <slot name="control"></slot>
    <div><error-helper v-if="name" :errors="errors" :field-name="name" /></div>
  </div>
</template>

<script>
import Errors from '@/classes/Errors'
import ErrorHelper from './ErrorHelper.vue'
export default {
  components: { ErrorHelper },
  props: {
    errors: {
      type: Errors,
      default: null,
    },
    name: {
      default: null,
      type: String,
    },
  },
}
</script>
