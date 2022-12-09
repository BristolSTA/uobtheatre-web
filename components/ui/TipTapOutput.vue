<template>
  <div class="tiptap-output" v-html="html" />
</template>

<script>
export default {
  props: {
    html: {
      required: true,
      type: String
    }
  }
};
</script>
