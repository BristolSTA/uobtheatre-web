<template>
  <button
    class="p-2 bg-white rounded-none transition-colors"
    :class="[
      isActive
        ? 'text-sta-orange'
        : 'text-sta-gray-dark hover:text-sta-orange-dark',
    ]"
    @click="$emit('click', editor.chain())"
  >
    <font-awesome-icon v-if="icon" :icon="icon" />
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    editor: {
      required: true,
      type: Object,
    },
    activeKey: {
      default: null,
      type: [String, Array],
    },
    icon: {
      default: null,
      type: String,
    },
  },
  computed: {
    isActive() {
      if (!this.activeKey) return

      if (Array.isArray(this.activeKey))
        return this.editor.isActive(...this.activeKey)
      return this.editor.isActive(this.activeKey)
    },
  },
}
</script>
