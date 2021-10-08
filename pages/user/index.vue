<template>
  <div class="mb-10 min-h-full text-white bg-sta-gray">
    <div class="container">
      <h1 class="pt-2 text-left text-h1">My Details</h1>
      <user-details v-if="user" class="pb-4" :user="user" />
    </div>

    <hr class="border-t-2 border-sta-gray-dark" />
    <div class="container">
      <h2 id="myBookings" class="px-4 py-2 text-h2">My Bookings</h2>
      <div v-if="!activeBookings.edges.length" class="p-6 text-center">
        <p class="p-2 text-h4">No Upcoming Bookings</p>
        <NuxtLink class="btn btn-orange m-2" to="/productions">
          View What's On
        </NuxtLink>
      </div>
      <div v-else class="flex flex-wrap justify-center">
        <div
          v-for="(booking, index) in activeBookings.edges.map(
            (edge) => edge.node
          )"
          :key="index"
          class="performance p-2 w-full md:w-1/2 xl:w-1/3"
        >
          <booking-summary-overview class="h-full" :booking="booking" />
        </div>
      </div>
      <div class="flex justify-center mb-10">
        <pagination-bar
          :page-info="activeBookings.pageInfo"
          :current-offset="activeBookingsOffset"
          @nextPage="activeBookingsOffset += activeBookings.edges.length"
          @previousPage="
            activeBookingsOffset = Math.max(
              activeBookingsOffset - activeBookings.edges.length,
              0
            )
          "
        />
      </div>
    </div>

    <div class="flex justify-center sm:container">
      <div class="w-full xl:w-3/4">
        <bookings-table
          ref="prev-bookings"
          :bookings="oldBookings.edges.map((edge) => edge.node)"
        >
          <template #title>Past Bookings</template>
        </bookings-table>
        <div class="flex justify-center">
          <pagination-bar
            :page-info="oldBookings.pageInfo"
            :current-offset="oldBookingsOffset"
            @nextPage="oldBookingsOffset += oldBookings.edges.length"
            @previousPage="
              oldBookingsOffset = Math.max(
                oldBookingsOffset - oldBookings.edges.length,
                0
              )
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BookingSummaryOverview from '@/components/booking/overview/BookingSummaryOverview.vue'
import BookingsTable from '@/components/user/BookingsTable.vue'
import UserDetails from '@/components/user/UserDetails.vue'
import PaginationBar from '@/components/ui/PaginationBar.vue'

export default {
  components: {
    BookingSummaryOverview,
    UserDetails,
    BookingsTable,
    PaginationBar,
  },
  middleware: 'authed',
  async asyncData({ app }) {
    const { data } = await app.apolloProvider.defaultClient.query({
      query: require('@/graphql/queries/user/MyAccountDetails.gql'),
      fetchPolicy: 'no-cache',
    })

    return {
      user: data.me,
    }
  },
  data() {
    return {
      activeBookings: { edges: [] },
      activeBookingsOffset: null,
      oldBookings: { edges: [] },
      oldBookingsOffset: null,
      user: null,
    }
  },
  head: {
    title: 'My Account',
  },
  apollo: {
    activeBookings: {
      query: require('@/graphql/queries/user/PaidBookings.gql'),
      variables() {
        return {
          active: true,
          max: 3,
          offset: this.activeBookingsOffset,
        }
      },
      update: (data) => data.me.bookings,
    },
    oldBookings: {
      query: require('@/graphql/queries/user/PaidBookings.gql'),
      variables() {
        return {
          active: false,
          offset: this.oldBookingsOffset,
        }
      },
      update: (data) => data.me.bookings,
    },
  },
}
</script>
