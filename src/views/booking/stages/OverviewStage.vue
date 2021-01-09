<template>
  <div class="space-y-2">
    <performance-overview-box
      :production="production"
      :performance="booking.performance"
    />
    <div class="grid gap-2 md:grid-cols-2 justify-evenly">
      <venue-overview :venue_slug="booking.performance.venue.slug" />
      <user-overview :booking="booking" />
    </div>
  </div>
</template>

<script>
import Booking from '@/classes/Booking';
import PerformanceOverviewBox from '@/components/overview/PerformanceOverviewBox.vue';
import UserOverview from '@/components/overview/UserOverview.vue';
import VenueOverview from '@/components/overview/VenueOverview.vue';

export default {
  name: 'overview-stage',
  components: { VenueOverview, PerformanceOverviewBox, UserOverview },
  props: {
    production: {
      required: true,
    },
    booking: {
      required: true,
      type: Booking,
    },
  },
};
</script>
