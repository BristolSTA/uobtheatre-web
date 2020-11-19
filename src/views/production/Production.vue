<template>
  <div class="bg-sta-gray min-h-full">
    <production-header :production="production" />
  </div>
</template>

<script>
import { productionService } from '@/services';
import ProductionHeader from './ProductionHeader.vue';
export default {
  components: { ProductionHeader },
  name: 'production',
  data() {
    return {
      production: null,
    };
  },
  created() {
    productionService
      .fetchProductionBySlug(this.$route.params.productionSlug)
      .then((data) => (this.production = data));
  },
};
</script>
