<template>
  <div class="min-h-full mb-10 text-white bg-sta-gray">
    <div class="container">
      <h1 class="pt-2 text-left text-h1">My Details</h1>
      <user-details v-if="user" class="pb-4" :user="user" />
    </div>

    <hr class="border-t-2 border-sta-gray-dark" />
    <div class="container">
      <h2 id="myBookings" class="px-4 py-2 text-h2">My Bookings</h2>
      <div v-if="!futureBookings.length" class="p-6 text-center">
        <p class="p-2 text-h4">No Upcoming Bookings</p>
        <NuxtLink class="m-2 btn btn-orange" to="/productions">
          View What's On
        </NuxtLink>
      </div>
      <div v-else class="flex flex-wrap justify-center">
        <div
          v-for="(booking, index) in futureBookings"
          :key="index"
          class="w-full p-2 performance md:w-1/2 xl:w-1/3"
        >
          <booking-summary-overview class="h-full" :booking="booking" />
        </div>
      </div>
    </div>

    <div class="flex justify-center sm:container">
      <div class="w-full xl:w-3/4">
        <bookings-table
          ref="prev-bookings"
          :bookings="pastBookings"
          :can-load-more="!!bookingsEndCursor"
          @load-more="loadMoreBookings"
        >
          <template #title>Past Bookings</template>
        </bookings-table>
      </div>
    </div>
  </div>
</template>

<script>
import Booking from '@/classes/Booking'
import BookingSummaryOverview from '@/components/booking/overview/BookingSummaryOverview.vue'
import BookingsTable from '@/components/user/BookingsTable.vue'
import UserDetails from '@/components/user/UserDetails.vue'

export default {
  components: {
    BookingSummaryOverview,
    UserDetails,
    BookingsTable,
  },
  middleware: 'authed',
  async asyncData({ app }) {
    const { data } = await app.apolloProvider.defaultClient.query({
      query: require('@/graphql/queries/user/MyAccountDetails.gql'),
      fetchPolicy: 'no-cache',
    })

    return {
      user: data.me,
      bookings: data.me.bookings.edges.map((edge) =>
        Booking.fromAPIData(edge.node)
      ),
      bookingsEndCursor: data.me.bookings.pageInfo.hasNextPage
        ? data.me.bookings.pageInfo.endCursor
        : null,
    }
  },
  data() {
    return {
      bookings: [],
      bookingsEndCursor: null,
      loadingMore: false,
      user: null,
    }
  },
  head: {
    title: 'My Account',
  },
  computed: {
    pastBookings() {
      return this.bookings.filter((booking) => !booking.isActive)
    },
    futureBookings() {
      return this.bookings.filter((booking) => booking.isActive)
    },
  },
  methods: {
    async loadMoreBookings() {
      if (this.loadingMore) return

      this.loadingMore = true
      const { data } = await this.$apollo.query({
        query: require('@/graphql/queries/user/MorePaidBookings.gql'),
        variables: {
          afterCursor: this.bookingsEndCursor,
        },
      })

      this.loadingMore = false
      this.bookings.push(
        ...data.me.bookings.edges.map((edge) => Booking.fromAPIData(edge.node))
      )

      this.bookingsEndCursor = null
      if (data.me.bookings.pageInfo.hasNextPage)
        this.bookingsEndCursor = data.me.bookings.pageInfo.endCursor
    },
  },
}
</script>
