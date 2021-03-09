<template>
  <div class="min-h-full mb-10 text-white bg-sta-gray">
    <div class="container">
      <h1 class="pt-2 text-left text-h1">My Details</h1>
      <user-details v-if="user" :user="user" />
    </div>

    <hr class="border-t-2 border-sta-gray-dark" />
    <div class="container">
      <h2 class="px-4 py-2 text-h2">My Bookings</h2>
      <div v-if="!futureBookings.length" class="p-6 text-center">
        <p class="p-2 text-h4">No Upcoming Bookings</p>
        <router-link
          class="m-2 btn btn-orange"
          :to="{
            name: 'productions',
          }"
        >
          View What's On
        </router-link>
      </div>
      <div v-else class="flex flex-wrap justify-center lg:flex-nowrap">
        <div
          v-for="(booking, index) in futureBookings"
          :key="index"
          class="w-full p-2 performance md:w-1/2 xl:w-1/3"
        >
          <booking-summary-overview class="h-full" :booking="booking" />
        </div>
      </div>
    </div>

    <div v-if="pastBookings.length" class="flex justify-center sm:container">
      <div class="w-full xl:w-3/4">
        <bookings-table ref="prev-bookings" :bookings="pastBookings">
          <template v-slot:title>Past Bookings</template>
        </bookings-table>
      </div>
    </div>
  </div>
</template>

<script>
import Booking from '@/classes/Booking';
import BookingSummaryOverview from '@/components/booking/overview/BookingSummaryOverview.vue';
import BookingsTable from '@/components/user/BookingsTable.vue';
import UserDetails from '@/components/user/UserDetails.vue';
import { createClient } from '@/vue-apollo';

export default {
  name: 'MyAccount',
  components: {
    BookingSummaryOverview,
    UserDetails,
    BookingsTable,
  },
  props: {},
  data() {
    return {
      bookings: [],
      user: null,
    };
  },
  metaInfo: {
    title: 'My Account',
  },
  computed: {
    pastBookings() {
      return this.bookings.filter((booking) => !booking.is_active);
    },
    futureBookings() {
      return this.bookings.filter((booking) => booking.is_active);
    },
  },
  async beforeRouteEnter(to, from, next) {
    const { apolloClient } = createClient();
    let { data } = await apolloClient.query({
      query: require('@/graphql/queries/MyAccountDetails.gql'),
    });

    next((vm) => {
      vm.user = data.me;

      vm.bookings = data.me.bookings.edges.map((edge) =>
        Booking.fromAPIData(edge.node)
      );
    });
  },
};
</script>
