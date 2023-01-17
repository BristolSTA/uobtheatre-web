<template>
  <div class="h-screen bg-sta-gray gap-5 font-body flex flex-col px-12 py-4">
    <div class="flex-none flex justify-around text-white items-center">
      <UiClock class="text-4xl" />
      <div class="bg-sta-rouge-dark h-20 w-80"></div>
      <NuxtLink class="underline">Exit Box Office</NuxtLink>
    </div>
    <div class="flex-none flex justify-between">
      <NuxtLink
        :href="`/box-office/${performance?.id}/sell`"
        class="bg-sta-green text-3xl text-white flex items-center justify-center p-3 px-8"
      >
        <font-awesome-icon icon="cash-register" class="mr-4" />Sell</NuxtLink
      >
      <div class="flex items-center gap-4">
        <UiInputToggle v-model="autoCheckIn" />
        <div class="flex flex-col items-center font-bold">
          <p class="text-white">Auto Check-In</p>
          <p class="text-sta-gray-lighter">
            {{ autoCheckIn ? 'Enabled' : 'Disabled' }}
          </p>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-5 font-body overflow-hidden flex-grow">
      <BoxOfficeDesktopCheckin />

      <div class="flex items-end gap-5">
        <UiInputText
          v-model="searchText"
          placeholder="Search for a name, email or booking reference"
          class="flex-grow"
        />
        <UiFormLabel>
          Filter
          <template #control>
            <UiInputSelect
              v-model="bookingFilter"
              :options="[
                { value: null, displayText: 'All' },
                { value: 'COMPS', displayText: 'Comps Only' },
                { value: 'NOCHECKIN', displayText: 'Not Checked In' }
              ]" /></template
        ></UiFormLabel>
      </div>

      <div class="flex-grow flex overflow-hidden gap-5">
        <div class="w-1/3">
          <BoxOfficeBookingTicketDetails
            v-if="inspectedObjects.ticket"
            :ticket="inspectedObjects.ticket"
            class="h-full overflow-y-auto"
          />
        </div>
        <div
          class="flex-grow bg-sta-gray-dark rounded-xl p-5 py-3 flex flex-col"
        >
          <template v-if="inspectedObjects.booking">
            <BoxOfficeBookingHeader
              :booking="inspectedObjects.booking"
              class="flex-none"
            />
            <div class="flex-grow overflow-y-auto my-2">
              <BoxOfficeBookingTickets
                :tickets="inspectedObjects.booking.tickets"
                class="w-full text-white"
                @select-ticket="onSelectTicket"
              />
            </div>
            <BoxOfficeButton
              class="bg-sta-green hover:bg-sta-green-dark text-white"
              >Check In Remaining 4 Tickets</BoxOfficeButton
            >
          </template>
          <div v-else class="overflow-y-auto flex flex-col h-full">
            <div
              v-if="loadingBookings"
              class="flex flex-grow items-center justify-center"
            >
              <UiLoadingIcon class="text-white text-5xl" />
            </div>
            <div
              v-else-if="!bookings || !bookings.length"
              class="flex flex-grow items-center justify-center text-white font-bold text-xl"
            >
              No Matching Bookings Found
            </div>
            <div v-else class="flex flex-col gap-3">
              <div
                v-for="booking in bookings"
                :key="booking.id"
                class="w-full bg-sta-gray-light p-3"
              >
                <BoxOfficeBookingHeader :booking="booking" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import InjectionKeys from '@/utils/injection-keys';
import {
  BoxOfficePerformanceBookingQuery,
  useBoxOfficePerformanceBookingsQuery
} from '~~/graphql/codegen/operations';
const performance = inject(InjectionKeys.boxOffice.performance);

if (!performance) throw createSafeError('Invalid performance');

const autoCheckIn = ref(true);
const searchText = ref<string>('');
const bookingFilter = ref<string | null>();
const offset = ref(0);

const { result: bookingsQueryResult, loading: loadingBookings } =
  useBoxOfficePerformanceBookingsQuery(() => ({
    id: performance.id,
    search: searchText.value,
    offset: offset.value,
    checkedIn: bookingFilter.value === 'NOCHECKIN' ? false : null,
    discount: bookingFilter.value === 'COMPS' ? 1 : null
  }));

const bookings = computed(() =>
  bookingsQueryResult.value
    ? (bookingsQueryResult.value.performance?.bookings.edges
        .map((edge) => edge?.node)
        .filter((booking) => booking !== null) as NonNullable<
        NonNullable<
          NonNullable<
            BoxOfficePerformanceBookingQuery['performance']
          >['bookings']['edges'][number]
        >['node']
      >[])
    : []
);

watch(loadingBookings, (newValue) => {
  if (newValue == true) {
    inspectedObjects.booking = undefined;
    inspectedObjects.ticket = undefined;
  }
});

const inspectedObjects = reactive({
  booking: {
    id: 'Qm9va2luZ05vZGU6MTM=',
    reference: '53ctYnGPYuMs',
    expired: false,
    expiresAt: '2023-01-17T16:44:35.749043+00:00',
    status: 'PAID',
    user: {
      id: 'VXNlck5vZGU6MDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAx',
      firstName: 'james',
      lastName: 'jelgar',
      __typename: 'ExtendedUserNode'
    },
    salesBreakdown: {
      totalPayments: 10600,
      __typename: 'SalesBreakdownNode'
    },
    priceBreakdown: {
      tickets: [
        {
          number: 10,
          seatGroup: {
            id: 'U2VhdEdyb3VwTm9kZToz',
            name: 'Best Seats In the House',
            __typename: 'SeatGroupNode'
          },
          concessionType: {
            id: 'Q29uY2Vzc2lvblR5cGVOb2RlOjE=',
            name: 'Adult',
            __typename: 'ConcessionTypeNode'
          },
          totalPrice: 10000,
          __typename: 'PriceBreakdownTicketNode'
        }
      ],
      miscCosts: [
        {
          name: 'Theatre improvement levy',
          description: null,
          percentage: 0.05,
          value: 500,
          __typename: 'MiscCostNode'
        },
        {
          name: 'Booking fee',
          description: null,
          percentage: null,
          value: 100,
          __typename: 'MiscCostNode'
        }
      ],
      ticketsPrice: 10000,
      ticketsDiscountedPrice: 10000,
      discountsValue: 0,
      subtotalPrice: 10000,
      miscCostsValue: 600,
      totalPrice: 10600,
      __typename: 'PriceBreakdownNode'
    },
    tickets: [
      {
        id: 'VGlja2V0Tm9kZToyMA==',
        seatGroup: {
          id: 'U2VhdEdyb3VwTm9kZToz',
          name: 'Best Seats In the House',
          __typename: 'SeatGroupNode'
        },
        concessionType: {
          id: 'Q29uY2Vzc2lvblR5cGVOb2RlOjE=',
          name: 'Adult',
          __typename: 'ConcessionTypeNode'
        },
        checkedInAt: '2023-01-17T17:00:00',
        checkedInBy: {
          firstName: 'Joe',
          lastName: 'Bloggs'
        },
        __typename: 'TicketNode'
      },
      {
        id: 'VGlja2V0Tm9kZToyMQ==',
        seatGroup: {
          id: 'U2VhdEdyb3VwTm9kZToz',
          name: 'Best Seats In the House',
          __typename: 'SeatGroupNode'
        },
        concessionType: {
          id: 'Q29uY2Vzc2lvblR5cGVOb2RlOjE=',
          name: 'Adult',
          __typename: 'ConcessionTypeNode'
        },
        checkedInAt: '2023-01-17T17:00:00',
        checkedInBy: {
          firstName: 'Joe',
          lastName: 'Bloggs'
        },
        __typename: 'TicketNode'
      },
      {
        id: 'VGlja2V0Tm9kZToyMg==',
        seatGroup: {
          id: 'U2VhdEdyb3VwTm9kZToz',
          name: 'Best Seats In the House',
          __typename: 'SeatGroupNode'
        },
        concessionType: {
          id: 'Q29uY2Vzc2lvblR5cGVOb2RlOjE=',
          name: 'Adult',
          __typename: 'ConcessionTypeNode'
        },
        checkedInAt: '2023-01-17T17:00:00',
        checkedInBy: {
          firstName: 'Joe',
          lastName: 'Bloggs'
        },
        __typename: 'TicketNode'
      },
      {
        id: 'VGlja2V0Tm9kZToyMw==',
        seatGroup: {
          id: 'U2VhdEdyb3VwTm9kZToz',
          name: 'Best Seats In the House',
          __typename: 'SeatGroupNode'
        },
        concessionType: {
          id: 'Q29uY2Vzc2lvblR5cGVOb2RlOjE=',
          name: 'Adult',
          __typename: 'ConcessionTypeNode'
        },
        checkedInAt: '2023-01-17T17:00:00',
        checkedInBy: {
          firstName: 'Joe',
          lastName: 'Bloggs'
        },
        __typename: 'TicketNode'
      },
      {
        id: 'VGlja2V0Tm9kZToyNA==',
        seatGroup: {
          id: 'U2VhdEdyb3VwTm9kZToz',
          name: 'Best Seats In the House',
          __typename: 'SeatGroupNode'
        },
        concessionType: {
          id: 'Q29uY2Vzc2lvblR5cGVOb2RlOjE=',
          name: 'Adult',
          __typename: 'ConcessionTypeNode'
        },
        checkedInAt: '2023-01-17T17:00:00',
        checkedInBy: {
          firstName: 'Joe',
          lastName: 'Bloggs'
        },
        __typename: 'TicketNode'
      },
      {
        id: 'VGlja2V0Tm9kZToyNQ==',
        seatGroup: {
          id: 'U2VhdEdyb3VwTm9kZToz',
          name: 'Best Seats In the House',
          __typename: 'SeatGroupNode'
        },
        concessionType: {
          id: 'Q29uY2Vzc2lvblR5cGVOb2RlOjE=',
          name: 'Adult',
          __typename: 'ConcessionTypeNode'
        },
        checkedInAt: '2023-01-17T17:00:00',
        checkedInBy: {
          firstName: 'Joe',
          lastName: 'Bloggs'
        },
        __typename: 'TicketNode'
      },
      {
        id: 'VGlja2V0Tm9kZToyNg==',
        seatGroup: {
          id: 'U2VhdEdyb3VwTm9kZToz',
          name: 'Best Seats In the House',
          __typename: 'SeatGroupNode'
        },
        concessionType: {
          id: 'Q29uY2Vzc2lvblR5cGVOb2RlOjE=',
          name: 'Adult',
          __typename: 'ConcessionTypeNode'
        },
        checkedInAt: '2023-01-17T17:00:00',
        checkedInBy: {
          firstName: 'Joe',
          lastName: 'Bloggs'
        },
        __typename: 'TicketNode'
      },
      {
        id: 'VGlja2V0Tm9kZToyNw==',
        seatGroup: {
          id: 'U2VhdEdyb3VwTm9kZToz',
          name: 'Best Seats In the House',
          __typename: 'SeatGroupNode'
        },
        concessionType: {
          id: 'Q29uY2Vzc2lvblR5cGVOb2RlOjE=',
          name: 'Adult',
          __typename: 'ConcessionTypeNode'
        },
        checkedInAt: '2023-01-17T17:00:00',
        checkedInBy: {
          firstName: 'Joe',
          lastName: 'Bloggs'
        },
        __typename: 'TicketNode'
      },
      {
        id: 'VGlja2V0Tm9kZToyOA==',
        seatGroup: {
          id: 'U2VhdEdyb3VwTm9kZToz',
          name: 'Best Seats In the House',
          __typename: 'SeatGroupNode'
        },
        concessionType: {
          id: 'Q29uY2Vzc2lvblR5cGVOb2RlOjE=',
          name: 'Adult',
          __typename: 'ConcessionTypeNode'
        },
        checkedInAt: '2023-01-17T17:00:00',
        checkedInBy: {
          firstName: 'Joe',
          lastName: 'Bloggs'
        },
        __typename: 'TicketNode'
      },
      {
        id: 'VGlja2V0Tm9kZToyOQ==',
        seatGroup: {
          id: 'U2VhdEdyb3VwTm9kZToz',
          name: 'Best Seats In the House',
          __typename: 'SeatGroupNode'
        },
        concessionType: {
          id: 'Q29uY2Vzc2lvblR5cGVOb2RlOjE=',
          name: 'Adult',
          __typename: 'ConcessionTypeNode'
        },
        checkedInAt: '2023-01-17T17:00:00',
        checkedInBy: {
          firstName: 'Joe',
          lastName: 'Bloggs'
        },
        __typename: 'TicketNode'
      }
    ],
    __typename: 'BookingNode',
    transactions: {
      edges: [
        {
          node: {
            id: 'VHJhbnNhY3Rpb25Ob2RlOjU=',
            createdAt: '2023-01-17T16:32:21.808929+00:00',
            type: 'PAYMENT',
            providerName: 'SQUARE_ONLINE',
            providerTransactionId: 'fvKZMHxoIm7gnWuQ1POzAt1Fy5eZY',
            providerFee: null,
            value: 10600,
            cardBrand: 'VISA',
            last4: '1111',
            __typename: 'TransactionNode'
          },
          __typename: 'TransactionNodeEdge'
        }
      ],
      __typename: 'TransactionNodeConnection'
    },
    performance: {
      id: 'UGVyZm9ybWFuY2VOb2RlOjM=',
      production: {
        id: 'UHJvZHVjdGlvbk5vZGU6MQ==',
        name: 'Legally Ginger',
        slug: 'legally-ginger',
        __typename: 'ProductionNode'
      },
      start: '2023-12-03T18:30:00+00:00',
      end: '2023-12-03T22:00:00+00:00',
      doorsOpen: '2023-12-03T18:00:00+00:00',
      venue: {
        id: 'VmVudWVOb2RlOjE=',
        slug: 'the-winston-theatre',
        __typename: 'VenueNode'
      },
      durationMins: 210,
      intervalDurationMins: null,
      __typename: 'PerformanceNode'
    }
  },
  ticket: {
    id: 'VGlja2V0Tm9kZToyMA==',
    seatGroup: {
      id: 'U2VhdEdyb3VwTm9kZToz',
      name: 'Best Seats In the House',
      __typename: 'SeatGroupNode'
    },
    concessionType: {
      id: 'Q29uY2Vzc2lvblR5cGVOb2RlOjE=',
      name: 'Adult',
      __typename: 'ConcessionTypeNode'
    },
    checkedInAt: '2023-01-17T17:00:00',
    checkedInBy: {
      firstName: 'Joe',
      lastName: 'Bloggs'
    },
    __typename: 'TicketNode'
  }
});

function onSelectTicket(selectedTicket: { id: string }) {
  inspectedObjects.ticket = inspectedObjects.booking.tickets.find(
    (ticket) => ticket.id == selectedTicket.id
  );
}
</script>
