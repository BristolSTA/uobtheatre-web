<script>
/* eslint-disable vue/no-v-html */
</script>
<template>
  <div class="tiptap-output" v-html="html"></div>
</template>

<script>
export default {
  props: {
    html: {
      required: true,
      type: String,
    },
  },
}
</script>
<style lang="scss">
.tiptap-output {
  h1 {
    @apply text-xl font-semibold;
  }

  h2 {
    @apply text-lg font-semibold;
  }

  p {
    @apply mb-4;
  }

  a {
    @apply text-sta-orange transition-colors;
    &:hover {
      @apply text-sta-orange-dark;
    }
  }

  img {
    @apply max-w-full;
  }
}
</style>
