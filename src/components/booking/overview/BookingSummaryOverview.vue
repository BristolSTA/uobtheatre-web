<template>
  <overview-box>
    <template v-slot:title>
      <font-awesome-icon icon="theater-masks" class="mr-2" />
      <router-link
        :to="{
          name: 'production',
          params: {
            productionSlug: booking.performance.production.slug,
          },
        }"
      >
        {{ booking.performance.production.name }}
      </router-link>
    </template>
    <template v-slot:subtitle>
      <p class="font-semibold sm:text-h3">
        {{ booking.performance.start | dateFormat('EEEE d MMMM kkkk') }}
      </p>
    </template>
    <div>
      <p class="py-1">Booking Ref: {{ booking.reference }}</p>
      <router-link
        class="btn btn-green"
        :to="{
          name: 'user.booking',
          params: { bookingRef: booking.reference },
        }"
      >
        View Booking &amp; Tickets
      </router-link>
    </div>
  </overview-box>
</template>

<script>
import Booking from '@/classes/Booking';

import OverviewBox from './OverviewBox.vue';
export default {
  name: 'BookingSumamryOverview',
  components: { OverviewBox },
  props: {
    booking: {
      required: true,
      type: Booking,
    },
  },
};
</script>
