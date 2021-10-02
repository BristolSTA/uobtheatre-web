<template>
  <th class="p-2" :class="{ 'text-left': textLeft }">
    <slot></slot>
  </th>
</template>

<script>
export default {
  props: {
    textLeft: {
      default: true,
      type: Boolean,
    },
  },
}
</script>
