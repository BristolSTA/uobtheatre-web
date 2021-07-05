<template>
  <font-awesome-icon
    icon="circle-notch"
    class="animate-spin"
    :class="sizeClass"
  />
</template>

<script>
export default {
  props: {
    sizeClass: {
      type: String,
      default: 'fa-2x',
    },
  },
}
</script>
