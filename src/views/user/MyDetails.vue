<template>
  <div class="min-h-full mb-10 text-white bg-sta-gray">
    <div class="container">
      <h1 class="pt-2 text-left text-h1">My Details</h1>
      <div>
        <div class="flex-wrap justify-center hidden m-6 md:flex lg:mx-10">
          <table class="w-full text-left align-text-top table-auto md:w-1/2">
            <tr class="mb-8">
              <th class="pr-8 text-sta-orange">First Name</th>
              <td>{{ user.firstName }}</td>
            </tr>
            <tr class="mb-4">
              <th class="pr-8 text-sta-orange">Last Name</th>
              <td>{{ user.lastName }}</td>
            </tr>
            <tr class="mb-4">
              <th class="pr-8 text-sta-orange">Email</th>
              <td>{{ user.email }}</td>
            </tr>
          </table>
          <table class="w-1/2 text-left">
            <tr class="pb-4 align-text-top">
              <th class="pr-8 text-sta-orange">Billing Address</th>
              <td>
                <p>James' House</p>
                <p>Somewher in the world</p>
                <p>BS69 420</p>
                <p>Brizzle</p>
              </td>
            </tr>
          </table>
        </div>
        <div class="flex flex-col justify-center my-4 text-center md:hidden">
          <strong class="text-sta-orange">First Name</strong>
          <p>{{ user.firstName }}</p>
          <strong class="pt-2 text-sta-orange">Last Name</strong>
          <p>{{ user.lastName }}</p>
          <strong class="pt-2 text-sta-orange">Email</strong>
          <p>{{ user.email }}</p>
          <strong class="pt-2 text-sta-orange">Billing Address</strong>
          <div>
            <p>James' House</p>
            <p>Somewher in the world</p>
            <p>BS69 420</p>
            <p>Brizzle</p>
          </div>
        </div>
      </div>

      <div>
        <div class="flex flex-wrap">
          <booking-summary-overview
            v-for="(booking, index) in bookings"
            :key="index"
            class="w-1/3"
            :booking="booking"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Booking from '@/classes/Booking';
import BookingSummaryOverview from '@/components/booking/overview/BookingSummaryOverview.vue';
import { createClient } from '@/vue-apollo';

export default {
  name: 'MyDetails',
  components: {
    BookingSummaryOverview,
  },
  props: {},
  data() {
    return {
      bookings: [],
      user: null,
    };
  },
  beforeRouteEnter(to, from, next) {
    const { apolloClient } = createClient();
    return apolloClient
      .query({
        query: require('@/graphql/queries/UserBookings.gql'),
      })
      .then(({ data }) => {
        next((vm) => {
          vm.user = (({ firstName, lastName, email }) => ({
            firstName,
            lastName,
            email,
          }))(data.authUser);
          //$store.state.auth.user.firstName
          vm.bookings = data.authUser.bookings.edges.map((edge) =>
            Booking.fromAPIData(edge.node)
          );
        });
      });
  },
};
</script>
