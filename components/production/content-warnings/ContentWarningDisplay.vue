<template>
  <div>
    <component
      :is="expandable ? 'button' : 'div'"
      class="w-full py-1 px-3 transition-colors group"
      :class="{
        'hover:bg-gray-600 rounded': expandable,
        'bg-gray-600 rounded-bl-none rounded-br-none': expanded && expandable,
      }"
      @click="
        if (expandable) {
          expanded = !expanded
        }
      "
    >
      <div class="flex justify-between items-center">
        <h3>{{ contentWarning.name }}</h3>
        <div
          v-if="contentWarning.description"
          class="rounded px-1"
          :class="{
            'border group-hover:border-0 group-hover:bg-white group-hover:text-gray-700':
              !expanded,
          }"
        >
          <span v-if="!expanded">See Details</span>
          <font-awesome-icon :icon="expanded ? 'chevron-up' : 'chevron-down'" />
        </div>
      </div>
    </component>
    <div
      v-if="contentWarning.description && expanded"
      class="p-3 bg-gray-700 overflow-x-auto rounded-bl rounded-br"
    >
      {{ contentWarning.description }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    contentWarning: {
      required: true,
      type: Object,
    },
    open: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      expanded: this.open,
    }
  },
  computed: {
    expandable() {
      return this.contentWarning.description
    },
  },
  watch: {
    open(newVal) {
      this.expanded = newVal
    },
    expanded(newVal) {
      this.$emit('update:open', newVal)
    },
  },
}
</script>
