<template>
  <a
    class="cursor-pointer"
    @click="$emit('click')"
    @keydown="
      (e) => {
        e.target.click();
      }
    "
  >
    <slot></slot>
  </a>
</template>

<script>
export default {
  name: 'ClickableLink',
};
</script>
