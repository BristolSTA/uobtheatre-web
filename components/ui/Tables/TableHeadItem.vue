<template>
  <th class="p-2" :class="{ 'text-left': textLeft }">
    <slot />
  </th>
</template>

<script>
export default {
  props: {
    textLeft: {
      default: true,
      type: Boolean
    }
  }
};
</script>
