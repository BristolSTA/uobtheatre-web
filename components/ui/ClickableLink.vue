<template>
  <a
    :class="{ 'cursor-pointer': !disabled }"
    @click="$emit('click')"
    @keypress="
      (e) => {
        e.target.click();
      }
    "
  >
    <slot />
  </a>
</template>

<script>
export default defineNuxtComponent({
  name: 'ClickableLink',
  props: {
    disabled: {
      default: false,
      type: Boolean
    }
  }
});
</script>
