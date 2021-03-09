<template>
  <div class="min-h-full mb-10 text-white bg-sta-gray">
    <div class="container">
      <h1 class="pt-2 text-left text-h1">My Details</h1>
      <div v-if="user">
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
        <div class="flex flex-col justify-center m-2 text-center md:hidden">
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
      <div v-if="user" class="flex justify-center m-4">
        <button class="btn btn-rouge btn-outline">Edit Details</button>
      </div>
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
                <p>Ref: {{ booking.bookingReference.slice(0, 12) }}</p>
                <router-link
                  class="px-2 py-1 text-sm sm:mr-2 btn btn-green btn-outline"
                  :to="{
                    name: 'user-booking',
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
import { DateTime } from 'luxon';

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
  computed: {
    pastBookings() {
      return this.bookings.filter((booking) => {
        return this.pastBooking(booking);
      });
    },
    futureBookings() {
      return this.bookings.filter((booking) => {
        return !this.pastBooking(booking);
      });
    },
  },
  methods: {
    pastBooking(booking) {
      return (
        DateTime.fromISO(booking.performance.end).minus({
          hours: 1,
        }) < DateTime.utc()
      );
    },
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
          }))(data.me);
          //$store.state.auth.user.firstName
          vm.bookings = data.me.bookings.edges.map((edge) =>
            Booking.fromAPIData(edge.node)
          );
        });
      });
  },
};
</script>
