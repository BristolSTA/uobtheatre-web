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

      <div class="flex justify-center mb-4">
        <div class="w-full lg:w-3/4">
          <!-- TODO: Implement search and filter -->
          <input
            type="text"
            class="w-64 p-2 m-2 text-gray-800 rounded outline-none"
            placeholder="Search on name or booking reference"
          />
          <div class="px-1 py-2 bg-sta-gray-dark sm:p-2">
            <div class="flex w-full px-4 font-semibold">
              <div class="flex-grow">Name<sort-icon /></div>
              <div class="px-2 w-36">Booking Ref<sort-icon /></div>
              <div class="w-20 px-1 text-center md:w-40 xl:w-52 2xl:w-72">
                Checked In?<sort-icon />
              </div>
              <div class="w-20 text-right">Price<sort-icon /></div>
            </div>
            <booking-row
              v-for="(booking, index) in bookings"
              :key="index"
              :expanded="selected_booking_index == index"
              :index="index"
              :booking="booking"
              class="mt-1"
              @select-booking="
                selected_booking_index =
                  selected_booking_index != index ? index : null
              "
            />
          </div>
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

export default {
  components: { Overview, BookingRow, SortIcon },

  props: {
    performance: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      selected_booking_index: null,
      bookingsdata: [
        {
          id: '4',
          reference: 'w9d4j3c6k5fb',
          name: 'james jelgar',
          performance: {
            id: '1',
            production: {
              id: '1',
              name: 'Legally Blonde',
              slug: 'legally-blonde',
              __typename: 'ProductionNode',
            },
            start: '2020-12-19T10:00:00',
            end: '2020-12-19T11:30:00',
            doorsOpen: '2020-12-19T09:30:00',
            venue: { slug: 'pegg-theatre', __typename: 'VenueNode' },
            durationMins: 180,
            __typename: 'PerformanceNode',
          },
          tickets: [
            {
              seatGroup: {
                id: '1',
                name: 'The best seats in the house',
                __typename: 'SeatGroupNode',
              },
              concessionType: {
                id: '1',
                name: 'Adult',
                __typename: 'ConcessionTypeNode',
              },
              id: '7',
            },
            {
              seatGroup: {
                id: '1',
                name: 'The best seats in the house',
                __typename: 'SeatGroupNode',
              },
              concessionType: {
                id: '1',
                name: 'Adult',
                __typename: 'ConcessionTypeNode',
              },
              id: '8',
            },
            {
              seatGroup: {
                id: '2',
                name: 'Proj Seats',
                __typename: 'SeatGroupNode',
              },
              concessionType: {
                id: '2',
                name: 'Child',
                __typename: 'ConcessionTypeNode',
              },
              id: '9',
            },
          ],
          priceBreakdown: {
            tickets: [
              {
                number: 2,
                seatGroup: {
                  id: '1',
                  name: 'The best seats in the house',
                  __typename: 'SeatGroupNode',
                },
                concessionType: {
                  id: '1',
                  name: 'Adult',
                  __typename: 'ConcessionTypeNode',
                },
                totalPrice: 1000,
                __typename: 'PriceBreakdownTicketNode',
                concession_type: {
                  id: '1',
                  name: 'Adult',
                  __typename: 'ConcessionTypeNode',
                },
                seat_group: {
                  id: '1',
                  name: 'The best seats in the house',
                  __typename: 'SeatGroupNode',
                },
              },
              {
                number: 1,
                seatGroup: {
                  id: '2',
                  name: 'Proj Seats',
                  __typename: 'SeatGroupNode',
                },
                concessionType: {
                  id: '2',
                  name: 'Child',
                  __typename: 'ConcessionTypeNode',
                },
                totalPrice: 800,
                __typename: 'PriceBreakdownTicketNode',
                concession_type: {
                  id: '2',
                  name: 'Child',
                  __typename: 'ConcessionTypeNode',
                },
                seat_group: {
                  id: '2',
                  name: 'Proj Seats',
                  __typename: 'SeatGroupNode',
                },
              },
            ],
            miscCosts: [
              {
                name: 'Booking Fee',
                description: 'explicabo non perspiciatis expedita ab',
                percentage: 0.05,
                value: 88,
                __typename: 'MiscCostNode',
                valuePounds: '0.88',
              },
            ],
            ticketsPrice: 1800,
            ticketsDiscountedPrice: 1753,
            discountsValue: 47,
            subtotalPrice: 1753,
            miscCostsValue: 88,
            totalPrice: 1841,
            __typename: 'PriceBreakdownNode',
          },
          dirty: false,
        },
        {
          id: '4',
          reference: '5e45i0r1vd4a',
          name: 'alexis toof',
          performance: {
            id: '1',
            production: {
              id: '1',
              name: 'Legally Blonde',
              slug: 'legally-blonde',
              __typename: 'ProductionNode',
            },
            start: '2020-12-19T10:00:00',
            end: '2020-12-19T11:30:00',
            doorsOpen: '2020-12-19T09:30:00',
            venue: { slug: 'pegg-theatre', __typename: 'VenueNode' },
            durationMins: 180,
            __typename: 'PerformanceNode',
          },
          tickets: [
            {
              seatGroup: {
                id: '1',
                name: 'The best seats in the house',
                __typename: 'SeatGroupNode',
              },
              concessionType: {
                id: '1',
                name: 'Adult',
                __typename: 'ConcessionTypeNode',
              },
              id: '7',
            },
          ],
          priceBreakdown: {
            tickets: [
              {
                number: 1,
                seatGroup: {
                  id: '1',
                  name: 'The best seats in the house',
                  __typename: 'SeatGroupNode',
                },
                concessionType: {
                  id: '1',
                  name: 'Adult',
                  __typename: 'ConcessionTypeNode',
                },
                totalPrice: 500,
                __typename: 'PriceBreakdownTicketNode',
                concession_type: {
                  id: '1',
                  name: 'Adult',
                  __typename: 'ConcessionTypeNode',
                },
                seat_group: {
                  id: '1',
                  name: 'The best seats in the house',
                  __typename: 'SeatGroupNode',
                },
              },
            ],
            miscCosts: [
              {
                name: 'Booking Fee',
                description: 'explicabo non perspiciatis expedita ab',
                percentage: 0.05,
                value: 23,
                __typename: 'MiscCostNode',
                valuePounds: '0.23',
              },
            ],
            ticketsPrice: 500,
            ticketsDiscountedPrice: 453,
            discountsValue: 47,
            subtotalPrice: 453,
            miscCostsValue: 23,
            totalPrice: 476,
            __typename: 'PriceBreakdownNode',
          },
          dirty: false,
        },
        {
          id: '4',
          reference: 'sy3gjtrgay82',
          performance: {
            id: '1',
            production: {
              id: '1',
              name: 'Legally Blonde',
              slug: 'legally-blonde',
              __typename: 'ProductionNode',
            },
            start: '2020-12-19T10:00:00',
            end: '2020-12-19T11:30:00',
            doorsOpen: '2020-12-19T09:30:00',
            venue: { slug: 'pegg-theatre', __typename: 'VenueNode' },
            durationMins: 60,
            __typename: 'PerformanceNode',
          },
          tickets: [
            {
              seatGroup: {
                id: '1',
                name: 'The best seats in the house',
                __typename: 'SeatGroupNode',
              },
              concessionType: {
                id: '1',
                name: 'Adult',
                __typename: 'ConcessionTypeNode',
              },
              id: '7',
            },
            {
              seatGroup: {
                id: '2',
                name: 'Proj Seats',
                __typename: 'SeatGroupNode',
              },
              concessionType: {
                id: '3',
                name: 'Student',
                __typename: 'ConcessionTypeNode',
              },
              id: '8',
            },
            {
              seatGroup: {
                id: '1',
                name: 'The best seats in the house',
                __typename: 'SeatGroupNode',
              },
              concessionType: {
                id: '2',
                name: 'Child',
                __typename: 'ConcessionTypeNode',
              },
              id: '6',
            },
            {
              seatGroup: {
                id: '1',
                name: 'The best seats in the house',
                __typename: 'SeatGroupNode',
              },
              concessionType: {
                id: '1',
                name: 'Adult',
                __typename: 'ConcessionTypeNode',
              },
              id: '9',
            },
          ],
          priceBreakdown: {
            tickets: [
              {
                number: 2,
                seatGroup: {
                  id: '1',
                  name: 'The best seats in the house',
                  __typename: 'SeatGroupNode',
                },
                concessionType: {
                  id: '1',
                  name: 'Adult',
                  __typename: 'ConcessionTypeNode',
                },
                totalPrice: 400,
                __typename: 'PriceBreakdownTicketNode',
                concession_type: {
                  id: '1',
                  name: 'Adult',
                  __typename: 'ConcessionTypeNode',
                },
                seat_group: {
                  id: '1',
                  name: 'The best seats in the house',
                  __typename: 'SeatGroupNode',
                },
              },
              {
                number: 1,
                seatGroup: {
                  id: '1',
                  name: 'The best seats in the house',
                  __typename: 'SeatGroupNode',
                },
                concessionType: {
                  id: '2',
                  name: 'Child',
                  __typename: 'ConcessionTypeNode',
                },
                totalPrice: 900,
                __typename: 'PriceBreakdownTicketNode',
                concession_type: {
                  id: '2',
                  name: 'Child',
                  __typename: 'ConcessionTypeNode',
                },
                seat_group: {
                  id: '1',
                  name: 'The best seats in the house',
                  __typename: 'SeatGroupNode',
                },
              },
              {
                number: 1,
                seatGroup: {
                  id: '2',
                  name: 'Proj Seats',
                  __typename: 'SeatGroupNode',
                },
                concessionType: {
                  id: '3',
                  name: 'Student',
                  __typename: 'ConcessionTypeNode',
                },
                totalPrice: 800,
                __typename: 'PriceBreakdownTicketNode',
                concession_type: {
                  id: '3',
                  name: 'Student',
                  __typename: 'ConcessionTypeNode',
                },
                seat_group: {
                  id: '2',
                  name: 'Proj Seats',
                  __typename: 'SeatGroupNode',
                },
              },
            ],
            miscCosts: [
              {
                name: 'Booking Fee',
                description: 'deleniti rerum deleniti ad ut',
                percentage: 0.05,
                value: 103,
                __typename: 'MiscCostNode',
                valuePounds: '1.03',
              },
            ],
            ticketsPrice: 2100,
            ticketsDiscountedPrice: 2067,
            discountsValue: 33,
            subtotalPrice: 2067,
            miscCostsValue: 103,
            totalPrice: 2170,
            __typename: 'PriceBreakdownNode',
          },
          dirty: false,
        },
      ],
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
    bookings() {
      return this.bookingsdata.map((data) => Booking.fromAPIData(data))
    },
  },
  methods: {},
}
</script>
