<template>
  <div class="max-w-full">
    <div class="flex flex-col items-center justify-between md:flex-row">
      <h1 v-if="title" class="text-h1">{{ title }}</h1>
      <div
        v-if="$slots.toolbar"
        class="flex flex-wrap gap-2 justify-between pb-2 md:flex-none"
      >
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
