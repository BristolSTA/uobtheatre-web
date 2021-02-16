<template>
  <production-banner
    class="pt-6 pb-12"
    :production="production"
    @on-buy-tickets-click="$emit('scroll-to-tickets')"
  />
</template>

<script>
import ProductionBanner from '@/components/production/ProductionBanner.vue';

export default {
  name: 'ProductionHeader',
  components: { ProductionBanner },
  props: {
    production: {
      required: true,
      type: Object,
    },
  },
};
</script>
