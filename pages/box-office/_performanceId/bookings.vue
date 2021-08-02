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
          <div class="flex justify-between space-x-2">
            <input
              v-model="searchQuery"
              type="text"
              class="p-2 mb-2 text-gray-800 rounded outline-none w-44 md:w-64"
              placeholder="Search"
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
            <loading-container :loading="$apollo.queries.bookings.loading">
              <paginated-table
                :page-info="pageInfo"
                :current-cursor="offset"
                @previousPage="
                  () => {
                    offset -= bookings.length
                  }
                "
                @nextPage="
                  () => {
                    offset += bookings.length
                  }
                "
              >
                <template #head>
                  <th>Name</th>
                  <th>Reference</th>
                  <th>Checked In?<sort-icon /></th>
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
            </loading-container>
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
        <ticket-scanner
          @scanned="
            ({ bookingReference, ticketId }) => {
              searchQuery = bookingReference
              scannedTicket = ticketId
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
import LoadingContainer from '@/components/ui/LoadingContainer.vue'
import TicketScanner from '@/components/ui/Inputs/TicketScanner.vue'
import PaginatedTable from '@/components/ui/Tables/PaginatedTable.vue'

export default {
  components: {
    Overview,
    BookingRow,
    SortIcon,
    BookingDetailsRow,
    LoadingContainer,
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

      selected_booking_index: null,

      scanning: false,
      scannedTicket: null,
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
        }
      },
      debounce: 100,
      update: (data) =>
        data.performance.bookings.edges.map((edge) =>
          Booking.fromAPIData(edge.node)
        ),
      result(result) {
        this.pageInfo = result.data.performance.bookings.pageInfo
      },
      fetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: true,
    },
  },
}
</script>
