<template>
  <div class="flex">
    <div class="w-6 mr-1 text-center">
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
    },
  },
};
</script>
