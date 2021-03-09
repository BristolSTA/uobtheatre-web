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
      <div
        ref="prev-bookings"
        class="w-full px-1 py-2 my-2 xl:w-3/4 md:p-2 bg-sta-gray-dark"
      >
        <h2 class="flex justify-center mb-2 text-2xl">Previous Bookings</h2>
        <table class="w-full table-auto">
          <tbody>
            <tr
              v-for="(booking, index) in pastBookings"
              :key="index"
              class="odd:bg-sta-gray-light even:bg-sta-gray"
            >
              <td class="px-2 sm:px-4">
                <div>
                  <router-link
                    class="text-xl font-semibold hover:text-gray-300"
                    :to="{
                      name: 'production',
                      params: {
                        productionSlug: booking.performance.production.slug,
                      },
                    }"
                  >
                    {{ booking.performance.production.name }}
                  </router-link>
                  <p class="text-sta-orange">
                    {{ booking.performance.start | dateFormat('d MMMM kkkk') }}
                  </p>
                </div>
              </td>

              <td class="px-2 py-2 text-right sm:px-4">
                <p>Ref: {{ booking.bookingReference }}</p>
                <router-link
                  class="px-2 py-1 text-sm sm:mr-2 btn btn-green btn-outline"
                  :to="{
                    name: 'user.booking',
                    params: { bookingRef: booking.id },
                  }"
                >
                  View Booking
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Booking from '@/classes/Booking';
import BookingSummaryOverview from '@/components/booking/overview/BookingSummaryOverview.vue';
import UserDetails from '@/components/user/UserDetails.vue';
import { createClient } from '@/vue-apollo';

export default {
  name: 'MyAccount',
  components: {
    BookingSummaryOverview,
    UserDetails,
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
