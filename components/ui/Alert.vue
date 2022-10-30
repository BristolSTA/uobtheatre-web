<template>
  <div
    class="p-2 mb-1"
    :class="[levelConfig.background, { 'text-center': centered }]"
  >
    <slot />
  </div>
</template>

<script>
const levelMap = {
  success: {
    background: 'bg-sta-green text-white'
  },
  info: {
    background: 'bg-blue-400 text-white'
  },
  warning: {
    background: 'bg-sta-orange text-white'
  },
  danger: {
    background: 'bg-sta-rouge text-white'
  }
};
export default defineNuxtComponent({
  props: {
    level: {
      type: String,
      default: 'info'
    },
    centered: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    levelConfig() {
      return levelMap[this.level] || {};
    }
  }
});
</script>
