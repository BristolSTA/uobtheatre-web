<template>
  <div>
    <div class="flex justify-between">
      <h1 v-if="title" class="text-h1">{{ title }}</h1>
      <div v-if="$slots.toolbar" class="space-x-2">
        <slot name="toolbar"></slot>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      default: null,
      type: String,
    },
  },
}
</script>
