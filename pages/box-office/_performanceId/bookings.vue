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
      <h2 class="mb-2 text-center text-h2">Performance Bookings</h2>

      <div v-if="!scanning" class="flex justify-center mb-4">
        <div class="px-2 w-full lg:max-w-4xl">
          <div class="flex justify-between space-x-2">
            <input
              v-model="searchQuery"
              type="text"
              class="mb-2 p-2 w-44 text-gray-800 rounded outline-none md:w-64"
              placeholder="Search"
            />
            <div class="flex-none">
              <button
                class="
                  p-2
                  bg-sta-green
                  hover:bg-sta-green-dark
                  rounded
                  focus:outline-none
                  transition-colors
                "
                @click="scanning = true"
              >
                Scan Ticket
              </button>
            </div>
          </div>
          <div class="px-1 py-2 bg-sta-gray-dark sm:p-2">
            <paginated-table
              :page-info="pageInfo"
              :offset.sync="offset"
              :items="bookings"
              :max-per-page="10"
              :loading="$apollo.queries.bookings.loading"
              :empty="!bookings.length"
              empty-text="No matching bookings found"
            >
              <template #head>
                <th>Name</th>
                <th>Reference</th>
                <th>Checked In?<sort-icon v-model="checkedInSort" /></th>
                <th>Price</th></template
              ><template v-for="(booking, index) in bookings">
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
                  :highlight-ticket-id="scannedTicket"
                />
              </template>
            </paginated-table>
          </div>
        </div>
      </div>
      <div v-else>
        <h3 class="text-center text-h3">Find a booking</h3>
        <p class="mb-6 text-center">
          <nuxt-link
            to="collect"
            class="hover:text-gray-300 underline transition-colors"
            >Looking to check in tickets?</nuxt-link
          >
        </p>
        <ticket-scanner
          @scanned="
            ({ bookingReference, ticketId }) => {
              searchQuery = bookingReference
              scannedTicket = ticketId
              scanning = false
            }
          "
        />
        <div class="text-center">
          <button
            class="
              p-2
              bg-gray-400
              hover:bg-gray-500
              rounded
              focus:outline-none
              transition-colors
            "
            @click="scanning = false"
          >
            Cancel
          </button>
        </div>
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
import TicketScanner from '@/components/ui/Inputs/TicketScanner.vue'
import PaginatedTable from '@/components/ui/Tables/PaginatedTable.vue'

export default {
  components: {
    Overview,
    BookingRow,
    SortIcon,
    BookingDetailsRow,
    TicketScanner,
    PaginatedTable,
  },
  props: {
    performance: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      bookings: [],
      pageInfo: {},
      offset: 0,
      searchQuery: null,
      checkedInSort: null,

      selected_booking_index: null,

      scanning: false,
      scannedTicket: null,
    }
  },
  computed: {
    crumbs() {
      return [
        { text: 'Box Office', path: '/box-office' },
        {
          text: `${
            this.performance.production.name
          } on ${this.$options.filters.dateFormat(
            this.performance.start,
            'ccc dd MMM T'
          )}`,
          path: `/box-office/${this.performance.id}`,
        },
        {
          text: 'All Bookings',
        },
      ]
    },
  },
  mounted() {
    if (this.$route.query.q) {
      this.searchQuery = this.$route.query.q
    }
    if (this.$route.query.qTicket) {
      this.scannedTicket = this.$route.query.qTicket
    }
  },
  apollo: {
    bookings: {
      query: BoxOfficePerformanceBookings,
      variables() {
        return {
          id: this.$route.params.performanceId,
          search: this.searchQuery,
          offset: this.offset,
          orderBy:
            this.checkedInSort !== null
              ? `${this.checkedInSort}checked_in`
              : null,
        }
      },
      debounce: 100,
      update: (data) =>
        data.performance.bookings.edges.map((edge) =>
          Booking.fromAPIData(edge.node)
        ),
      result(result) {
        if (result.data)
          this.pageInfo = result.data.performance.bookings.pageInfo
      },
      fetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: true,
    },
  },
}
</script>
