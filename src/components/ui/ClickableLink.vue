<template>
  <a
    href="#"
    @click="$emit('click')"
    @keydown="
      (e) => {
        e.target.click();
      }
    "
    ><slot
  /></a>
</template>

<script>
export default {
  name: 'clickable-link',
};
</script>