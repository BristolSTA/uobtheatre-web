<template>
  <production-banner
    class="py-12"
    :production="production"
    @on-buy-tickets-click="$emit('scroll-to-tickets')"
  />
</template>

<script>
import ProductionBanner from '@/components/production/ProductionBanner.vue';

export default {
  components: { ProductionBanner },
  name: 'ProductionHeader',
  props: {
    production: {
      required: true,
    },
  },
};
</script>
