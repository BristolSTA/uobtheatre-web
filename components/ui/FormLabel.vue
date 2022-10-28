<template>
  <div>
    <label>
      <span :class="[labelClass, { underline: underline }]"><slot /></span>
      <required-star v-if="required" />
      <p v-if="$slots.helper" class="text-gray-400 text-sm">
        <slot name="helper" />
      </p>
    </label>
    <slot name="control" />
    <div><error-helper v-if="name" :errors="errors" :field-name="name" /></div>
  </div>
</template>

<script>
import ErrorHelper from './ErrorHelper.vue';
import RequiredStar from './Form/RequiredStar.vue';
import Errors from '@/classes/Errors';
export default {
  components: { ErrorHelper, RequiredStar },
  props: {
    errors: {
      type: Errors,
      default: null,
    },
    name: {
      default: null,
      type: String,
    },
    labelClass: {
      default: 'text-white text-xs font-semibold',
      type: [String, Array, Object],
    },
    underline: {
      default: true,
      type: Boolean,
    },
    required: {
      default: false,
      type: Boolean,
    },
  },
};
</script>
