<template>
  <div class="min-h-full bg-sta-gray">
    <div
      v-if="!production"
      class="justify-center py-20 text-xl font-semibold text-center text-white"
    >
      Loading Production...
    </div>
    <template v-else>
      <production-header
        ref="header"
        :production="production"
        @scroll-to-tickets="$refs.performances.$el.scrollIntoView()"
      />
      <hr class="border-t-2 border-sta-gray-dark" />
      <production-cast-credits ref="cast-credits" :production="production" />
      <hr class="border-t-2 border-sta-gray-dark" />
      <production-performances ref="performances" :production="production" />
    </template>
  </div>
</template>

<script>
import ProductionCastCredits from './ProductionCastCredits.vue';
import ProductionHeader from './ProductionHeader.vue';
import ProductionPerformances from './ProductionPerformances.vue';
export default {
  name: 'Production',
  components: {
    ProductionHeader,
    ProductionCastCredits,
    ProductionPerformances,
  },
  metaInfo() {
    const productionName = this.production
      ? this.production.name
      : 'Loading...';
    return {
      title: `${productionName}`,
    };
  },
  props: {
    production: {
      required: true,
      type: Object,
    },
  },
};
</script>
