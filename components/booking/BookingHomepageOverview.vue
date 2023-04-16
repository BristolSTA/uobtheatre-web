<template>
  <div class="flex flex-wrap justify-center">
    <div
      v-for="(booking, index) in props.bookings"
      :key="index"
      class="performance p-2 w-full md:w-1/2 xl:w-1/3"
    >
      <booking-summary-overview class="h-full" :booking="booking" />
    </div>
  </div>
</template>

<script setup lang="ts">
import BookingSummaryOverview from '@/components/booking/overview/BookingSummaryOverview.vue';
import { UpcomingBookingsQuery } from '~~/graphql/codegen/operations';

const props = defineProps<{
  bookings: Array<
    NonNullable<
      NonNullable<
        NonNullable<UpcomingBookingsQuery['me']>['bookings']['edges'][number]
      >['node']
    >
  >;
}>();
</script>
