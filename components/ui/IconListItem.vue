<template>
  <div class="flex">
    <div class="text-center" style="width: 1.5em; margin-right: 1em">
      <font-awesome-icon :icon="icon" />
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>

<script>
export default defineNuxtComponent({
  name: 'IconListItem',
  props: {
    icon: {
      requried: true,
      type: [Array, String],
      default: null
    }
  }
});
</script>
