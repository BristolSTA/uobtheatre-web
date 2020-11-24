<template>
  <div class="min-h-full bg-sta-gray">
    <production-header
      :production="production"
      @scroll-to-tickets="$refs.performances.$el.scrollIntoView()"
      ref="header"
    />
    <hr class="border-t-2 border-sta-gray-dark" />
    <production-cast-credits :production="production" ref="cast-credits" />
    <hr class="border-t-2 border-sta-gray-dark" />
    <production-performances ref="performances" :production="production" />
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
  metaInfo() {
    const productionName = this.production
      ? this.production.name
      : 'Loading...';
    return {
      title: `${productionName}`,
    };
  },
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
