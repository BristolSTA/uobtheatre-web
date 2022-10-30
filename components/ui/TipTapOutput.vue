<template>
  <div class="tiptap-output" v-html="html" />
</template>

<script>
export default defineNuxtComponent({
  props: {
    html: {
      required: true,
      type: String
    }
  }
});
</script>
