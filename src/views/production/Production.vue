<template>
  <div class="bg-sta-gray min-h-full">
    <production-header :production="production" />
    <hr class="border-sta-gray-dark border-t-2" />
    <production-cast-credits :production="production" />
    <hr class="border-sta-gray-dark border-t-2" />
    <production-performances :production="production" />
  </div>
</template>

<script>
import { productionService } from '@/services';
import ProductionHeader from './ProductionHeader.vue';
import ProductionCastCredits from './ProductionCastCredits.vue';
import ProductionPerformances from './ProductionPerformances.vue';
export default {
  components: {
    ProductionHeader,
    ProductionCastCredits,
    ProductionPerformances,
  },
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
