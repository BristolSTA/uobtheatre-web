<template>
  <div
    v-if="!bookings.length"
    class="flex flex-grow items-center justify-center text-white font-bold text-xl"
  >
    No Matching Bookings Found
  </div>
  <div v-else class="flex flex-col gap-3">
    <div
      v-for="booking in bookings"
      :key="booking.id"
      class="w-full bg-sta-gray-light hover:bg-sta-orange cursor-pointer p-1 md:p-3"
      @click="emit('select', booking)"
    >
      <BoxOfficeBookingHeader :booking="booking" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { BookingNode } from '~~/graphql/codegen/operations';
import { IBookingHeaderProp } from '../BoxOfficeSharedTypes';

type Booking = IBookingHeaderProp & Pick<BookingNode, 'id'>;

defineProps<{
  bookings: Booking[];
}>();

const emit = defineEmits<{
  (event: 'select', booking: Booking): void;
}>();
</script>
