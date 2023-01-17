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
  booking: undefined,
  ticket: undefined
});

function onSelectTicket(selectedTicket: { id: string }) {
  inspectedObjects.ticket = inspectedObjects.booking.tickets.find(
    (ticket) => ticket.id == selectedTicket.id
  );
}
</script>
