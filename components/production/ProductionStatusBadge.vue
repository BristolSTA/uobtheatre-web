<template>
  <badge class="text-white" :class="colours">
    {{ status }}
  </badge>
</template>

<script>
import Badge from '../ui/Badge.vue'
import ProductionStatusEnum from '@/enums/ProductionStatusEnum'
export default {
  components: { Badge },
  props: {
    production: {
      required: true,
      type: Object
    }
  },
  computed: {
    colours () {
      if (['Pending'].includes(this.status)) { return 'bg-sta-orange' }
      if (['Closed', 'Not Bookable'].includes(this.status)) { return 'bg-sta-rouge' }
      if (['Published'].includes(this.status)) { return 'bg-sta-green' }
      if (['Complete'].includes(this.status)) { return 'bg-gray-600' }
      return 'bg-gray-500'
    },
    status () {
      if (
        !this.production.isBookable &&
        (!this.production.status || this.production.status === 'PUBLISHED')
      ) { return 'Not Bookable' }
      return new ProductionStatusEnum(this.production.status).name
    }
  }
}
</script>
