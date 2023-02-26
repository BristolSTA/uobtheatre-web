<template>
  <div>
    <input
      v-if="!disabled"
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <font-awesome-icon
      v-else
      :icon="modelValue ? 'check-circle' : 'times-circle'"
      :class="modelValue ? 'text-sta-green' : 'text-sta-rouge'"
    />
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue']
};
</script>
