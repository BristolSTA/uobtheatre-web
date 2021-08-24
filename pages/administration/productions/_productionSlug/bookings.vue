<template>
  <div></div>
</template>

<script>
import BoxOfficePerformanceBookingsQuery from '@/graphql/queries/box-office/BoxOfficePerformanceBookings.gql'
export default {
  data() {
    return {
      bookings: [],
    }
  },
  apollo: {
    bookings: {
      query: BoxOfficePerformanceBookingsQuery,
    },
  },
}
</script>
