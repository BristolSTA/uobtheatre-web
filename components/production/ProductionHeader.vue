<template>
  <production-banner
    class="pb-12 pt-6"
    :production="production"
    @on-buy-tickets-click="$emit('scroll-to-tickets')"
  />
</template>

<script>
import ProductionBanner from '@/components/production/ProductionBanner.vue'

export default {
  name: 'ProductionHeader',
  components: { ProductionBanner },
  props: {
    production: {
      required: true,
      type: Object,
    },
  },
}
</script>
