<template>
  <div
    v-if="!bookings || !bookings.length"
    class="flex grow items-center justify-center text-white font-bold text-xl"
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
    <UiPaginationBar
      v-if="paginationInfo"
      class="mx-auto"
      :has-next-page="paginationInfo.hasNextPage"
      :current-offset="paginationInfo.currentOffset"
      @next-page="
        emit(
          'update:offset',
          paginationInfo
            ? paginationInfo.currentOffset + paginationInfo?.pageMaxLength
            : 0
        )
      "
      @previous-page="
        emit(
          'update:offset',
          paginationInfo
            ? paginationInfo.currentOffset - paginationInfo?.pageMaxLength
            : 0
        )
      "
    />
  </div>
</template>

<script lang="ts" setup>
import type { BookingNode } from '~~/graphql/codegen/operations';
import type { PaginationInfo } from '~~/types/generic';
import type { IBookingHeaderProp } from '../../../types/box-office';

type Booking = IBookingHeaderProp & Pick<BookingNode, 'id'>;

defineProps<{
  bookings?: Booking[];
  paginationInfo?: PaginationInfo;
}>();

const emit = defineEmits<{
  (event: 'select', booking: Booking): void;
  (event: 'update:offset', offset: number): void;
}>();
</script>
