<template>
  <div class="gap-5 flex flex-none bg-sta-gray-dark rounded-xl p-5">
    <BoxOfficeScanIndicator
      state="success"
      class="h-28 w-4/12 flex-none text-7xl"
    />
    <div
      class="p-5 border-2 border-white text-white flex items-center justify-center flex-grow text-4xl overflow-clip"
    >
      Error Message In Here
    </div>
  </div>
</template>

<script lang="ts" setup>
// type Booking = NonNullable<
//   NonNullable<
//     BoxOfficePerformanceBookingQuery['performance']
//   >['bookings']['edges'][number]
// >['node'];

// interface InspectedObjects {
//   bookings: Booking[] | undefined;
//   booking: Booking;
//   ticket:
//     | Pick<
//         TicketNode,
//         'id' | 'seatGroup' | 'concessionType' | 'checkedInAt' | 'checkedInBy'
//       >
//     | undefined;
// }
</script>
