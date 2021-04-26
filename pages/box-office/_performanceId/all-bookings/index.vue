<template>
  <div class="min-h-full bg-sta-gray">
    <div class="bg-sta-gray-light">
      <div class="sm:container">
        <breadcrumbs :crumbs="crumbs" />
      </div>
    </div>
    <div class="sm:container">
      <div class="sm:py-6">
        <overview
          :production="performance.production"
          :performance="performance"
          :detailed="false"
        />
      </div>
      <div class="flex justify-center mb-4">
        <div class="w-full px-1 py-2 sm:p-2 lg:w-3/4 bg-sta-gray-dark">
          <h2 class="flex justify-center mb-2 text-2xl">All Bookings</h2>
          <div>
            <booking
              v-for="(booking, index) in bookings"
              :key="index"
              :expanded="selected_booking_index == index"
              :index="index"
              :booking="booking"
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
import BoxOfficePerformance from '@/graphql/queries/BoxOfficePerformance.gql'

import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import Overview from '@/components/box-office/Overview.vue'
import Booking from '@/components/box-office/Booking.vue'

export default {
  components: { Overview, Booking, Breadcrumbs },
  props: {},
  async asyncData({ params, error, app }) {
    // Execute query
    const { data } = await app.apolloProvider.defaultClient.query({
      query: BoxOfficePerformance,
      variables: {
        id: params.performanceId,
      },
    })

    const performance = data.performance
    if (!performance)
      return error({
        statusCode: 404,
        message: 'This performance does not exist',
      })
    return {
      performance,
    }
  },
  data() {
    return {
      selected_booking_index: null,
      bookings: [
        {
          id: '4',
          reference: '5e45i0r1vd4a',
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
          payments: [],
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
          payments: [],
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
      ],
    }
  },
  computed: {
    crumbs() {
      return [
        { text: 'Box Office', route: '/box-office' },
        {
          text: `${this.performance.production.name} on day X`,
          route: `/box-office/${this.performance.id}`,
        },
        {
          text: 'All Bookings',
        },
      ]
    },
  },
}
</script>
