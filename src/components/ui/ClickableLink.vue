<template>
  <a
    class="cursor-pointer"
    @click="$emit('click')"
    @keypress="
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