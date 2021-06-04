<template>
  <div class="min-h-full bg-sta-gray">
    <div class="sm:container">
      <div class="sm:py-6">
        <overview
          :production="performance.production"
          :performance="performance"
          :detailed="false"
        />
      </div>
      <h2 class="mb-2 text-center text-h2">All Bookings</h2>

      <div v-if="!scanning" class="flex justify-center mb-4">
        <div class="w-full px-2 lg:max-w-4xl">
          <div class="flex space-x-2">
            <input
              v-model="searchQuery"
              type="text"
              class="w-64 p-2 mb-2 text-gray-800 rounded outline-none"
              placeholder="Search on name or booking reference"
            />
            <div class="flex-none">
              <button
                class="p-2 transition-colors rounded focus:outline-none bg-sta-green hover:bg-sta-green-dark"
                @click="scanning = true"
              >
                Scan Ticket
              </button>
            </div>
          </div>
          <div class="px-1 py-2 bg-sta-gray-dark sm:p-2">
            <table class="w-full">
              <thead>
                <th>Name</th>
                <th>Reference</th>
                <th>Checked In?<sort-icon /></th>
                <th>Price</th>
              </thead>
              <tbody>
                <template v-for="(booking, index) in bookings">
                  <booking-row
                    :key="`${index}-row`"
                    :index="index"
                    :booking="booking"
                    :active="selected_booking_index == index"
                    @select-booking="
                      selected_booking_index =
                        selected_booking_index != index ? index : null
                    "
                  />
                  <booking-details-row
                    v-if="selected_booking_index == index"
                    :key="`${index}-details`"
                    :index="index"
                    :booking="booking"
                  />
                </template>
              </tbody>
            </table>
            <!-- <div class="flex items-center w-full px-4 font-semibold">
              <div class="">Name</div>
              <div class="px-2">Reference</div>
              <div class="w-20 px-1 text-center md:w-40 xl:w-52 2xl:w-72">
                Checked In?<sort-icon />
              </div>
              <div class="w-20 text-right">Price</div>
            </div> -->
          </div>
        </div>
      </div>
      <div v-else>
        <div class="text-center">
          <p>Find a booking via scanning</p>
          <button
            class="p-2 transition-colors bg-gray-400 rounded focus:outline-none hover:bg-gray-500"
            @click="scanning = false"
          >
            Cancel
          </button>
        </div>
        <hardware-scanner
          @scanned="
            ({ bookingReference }) => {
              searchQuery = bookingReference
              scanning = false
            }
          "
        />
      </div>
    </div>
  </div>
</template>

<script>
import Booking from '@/classes/Booking.js'

import Overview from '@/components/box-office/Overview.vue'
import BookingRow from '@/components/box-office/BookingRow.vue'
import SortIcon from '@/components/ui/SortIcon.vue'
import BoxOfficePerformanceBookings from '@/graphql/queries/box-office/BoxOfficePerformanceBookings.gql'
import BookingDetailsRow from '@/components/box-office/BookingDetailsRow.vue'
import HardwareScanner from '@/components/box-office/HardwareScanner.vue'

export default {
  components: {
    Overview,
    BookingRow,
    SortIcon,
    BookingDetailsRow,
    HardwareScanner,
  },
  props: {
    performance: {
      required: true,
      type: Object,
    },
  },
  async asyncData({ params, query, app }) {
    // TODO: Implement search and filtering in query
    const { data } = await app.apolloProvider.defaultClient.query({
      query: BoxOfficePerformanceBookings,
      variables: {
        id: params.performanceId,
      },
    })
    return {
      bookings: data.performance.bookings.edges.map((edge) =>
        Booking.fromAPIData(edge.node)
      ),
      searchQuery: query.q,
    }
  },
  data() {
    return {
      selected_booking_index: null,
      bookings: [],
      searchQuery: null,
      scanning: false,
    }
  },
  computed: {
    crumbs() {
      return [
        { text: 'Box Office', route: '/box-office' },
        {
          text: `${
            this.performance.production.name
          } on ${this.$options.filters.dateFormat(
            this.performance.start,
            'ccc dd MMM T'
          )}`,
          route: `/box-office/${this.performance.id}`,
        },
        {
          text: 'All Bookings',
        },
      ]
    },
  },
  methods: {},
}
</script>
