<template>
  <div class="flex">
    <div class="w-6 text-center mr-1">
      <font-awesome-icon :icon="icon" />
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'icon-list-item',
  props: {
    icon: {
      requried: true,
    },
  },
};
</script>