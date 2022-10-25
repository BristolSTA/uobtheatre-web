<template>
  <div class="flex flex-col h-full justify-evenly items-center w-screen">
    <h1 class="text-sta-gold text-rlg font-bold text-center">
      {{ production.name }}
    </h1>
    <production-featured-image
      :image-object="production.featuredImage"
      style="max-width: 100%; width: 50vw"
    />
  </div>
</template>

<script>
import ProductionFeaturedImage from "../production/ProductionFeaturedImage.vue";
export default {
  components: { ProductionFeaturedImage },
  props: {
    performance: {
      required: true,
      type: Object,
    },
    production: {
      required: true,
      type: Object,
    },
  },
};
</script>
