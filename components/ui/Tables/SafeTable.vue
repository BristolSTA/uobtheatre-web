<template>
  <div class="overflow-auto">
    <table class="w-full" :class="tableClass">
      <slot />
    </table>
  </div>
</template>

<script>
export default {
  props: {
    tableClass: {
      default: null,
      type: [Array, Object, String]
    }
  }
}
</script>
