<template>
  <badge class="text-white" :class="colours">{{ status }}</badge>
</template>

<script>
import Badge from '../ui/Badge.vue'
export default {
  components: { Badge },
  props: {
    performance: {
      required: true,
      type: Object,
    },
  },
  computed: {
    colours() {
      if (['Disabled', 'Sold out'].includes(this.status)) return 'bg-sta-rouge'
      if (['Bookable'].includes(this.status)) return 'bg-sta-green'
      return 'bg-gray-500'
    },
    status() {
      if (this.performance.disabled) return 'Disabled'
      if (this.performance.soldOut) return 'Sold out'
      if (!this.performance.isBookable) return 'Unavailable'
      return 'Bookable'
    },
  },
}
</script>
