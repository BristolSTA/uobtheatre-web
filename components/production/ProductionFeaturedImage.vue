<template>
  <img :src="imageUrl" />
</template>

<script>
import PlaceholderImage from '@/assets/images/placeholder-feature-image.png';

export default defineNuxtComponent({
  props: {
    imageObject: {
      required: true,
      type: Object
    }
  },
  computed: {
    imageUrl() {
      return this.imageObject ? this.imageObject.url : PlaceholderImage;
    }
  }
});
</script>
