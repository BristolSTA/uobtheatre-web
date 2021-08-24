<template>
  <overview-box>
    <template #title>
      <font-awesome-icon icon="theater-masks" class="mr-2" />
      <NuxtLink :to="`/production/${booking.performance.production.slug}`">
        {{ booking.performance.production.name }}
      </NuxtLink>
    </template>
    <template #subtitle>
      <p class="font-semibold sm:text-h3">
        {{ booking.performance.start | dateFormat('EEEE d MMMM kkkk') }}
      </p>
    </template>
    <div>
      <p class="py-1">
        Booking Ref: <span class="font-mono">{{ booking.reference }}</span>
      </p>
      <NuxtLink
        class="btn btn-green"
        :to="`/user/booking/${booking.reference}`"
      >
        View Booking &amp; Tickets
      </NuxtLink>
    </div>
  </overview-box>
</template>

<script>
import Booking from '@/classes/Booking'

import OverviewBox from '../../ui/Card.vue'
export default {
  name: 'BookingSumamryOverview',
  components: { OverviewBox },
  props: {
    booking: {
      required: true,
      type: [Booking, Object],
    },
  },
}
</script>
