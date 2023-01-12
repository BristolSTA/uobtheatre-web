<template>
  <div>
    <input
      v-if="!disabled"
      type="checkbox"
      :checked="checked"
      @change="$emit('change', $event)"
    />
    <font-awesome-icon
      v-else
      :icon="checked ? 'check-circle' : 'times-circle'"
      :class="checked ? 'text-sta-green' : 'text-sta-rouge'"
    />
  </div>
</template>

<script>
export default {
  props: {
    checked: {
      type: Boolean,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['change']
};
</script>
