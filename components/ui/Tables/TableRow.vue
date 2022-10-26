<template>
  <tr :class="classes" @click="clickable ? $emit('click') : null">
    <slot />
  </tr>
</template>

<script>
export default {
  props: {
    striped: {
      default: true,
      type: Boolean,
    },
    clickable: {
      default: false,
      type: Boolean,
    },
  },
  computed: {
    classes() {
      const classes = [];
      if (this.striped) {
        classes.push('odd:bg-sta-gray even:bg-sta-gray-dark');
      }
      if (this.clickable) {
        classes.push('hover:bg-sta-orange transition-colors cursor-pointer');
      }
      return classes;
    },
  },
};
</script>
