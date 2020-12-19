<template>
  <div class="min-h-full bg-sta-gray">
    <div class="container flex">
      <booking-navigation
        class="w-1/3"
        :currentStageIndex="currentStageIndex"
      />
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import BookingNavigation from '@/views/bookings/components/BookingNavigation';

import { getStageIndex } from './bookingStages';
export default {
  components: { BookingNavigation },
  computed: {
    currentStageIndex() {
      return getStageIndex(this.$route.meta.stage);
    },
  },
};
</script>