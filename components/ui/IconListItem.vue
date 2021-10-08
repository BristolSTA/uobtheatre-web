<template>
  <div class="flex">
    <div class="mr-1 w-6 text-center">
      <font-awesome-icon :icon="icon" />
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IconListItem',
  props: {
    icon: {
      requried: true,
      type: [Array, String],
      default: null,
    },
  },
}
</script>
