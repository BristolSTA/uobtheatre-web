<template>
  <div class="h-screen bg-sta-gray font-body flex flex-col px-4 md:px-12 py-4">
    <BoxOfficeHeader />
    <div
      class="flex-none flex flex-col md:flex-row items-center justify-center md:justify-between mt-5"
    >
      <NuxtLink
        :href="`/box-office/${performance?.id}/sell`"
        class="bg-sta-green text-3xl text-white p-3 px-8 hidden md:block"
      >
        <div><font-awesome-icon icon="cash-register" class="mr-2" /> Sell</div>
        <p class="text-sm">100 available</p>
      </NuxtLink>

      <BoxOfficeSchedule />
      <BoxOfficeCheckInProgress class="w-60" />
      <div class="flex flex-none gap-4 w-full md:w-auto">
        <BoxOfficeAutoCheckInControl
          v-model="autoCheckIn"
          class="hidden md:flex"
        />
        <NuxtLink
          :href="`/box-office/${performance?.id}/scan`"
          class="bg-sta-green text-white p-2 md:p-4 rounded flex items-center justify-center mt-3 md:mt-0 w-full md:w-auto"
        >
          <font-awesome-icon icon="camera" class="text-xl" />
          <span class="md:hidden ml-4">Scan Tickets</span>
        </NuxtLink>
      </div>
    </div>
    <div class="flex flex-col gap-5 font-body overflow-y-hidden flex-grow">
      <BoxOfficeBookingFilterBar
        v-model:filter-value="searchFilter"
        v-model:text-search-value="searchText"
      />

      <div class="flex-grow flex overflow-hidden gap-5">
        <BoxOfficeBookingInspector
          v-model:selected-booking="selectedBooking"
          :selected-ticket="selectedTicket"
          :bookings="bookings"
          :loading-bookings="loadingBookings || loadingSelectedBooking"
          :performance-id="performance.id"
          @starting-check-in="setCheckInState()"
          @check-in-error="setCheckInState(false, $event)"
          @checked-in="setCheckInState(true, $event)"
          @un-checked-in="setCheckInState(undefined, $event)"
          @update:selected-ticket="queryTicketId = $event?.id"
        />
      </div>
      <BoxOfficeDesktopCheckin
        :state="checkInState"
        class="bg-sta-gray-dark p-4 hidden md:block"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import InjectionKeys from '@/utils/injection-keys';
import type {
  ICheckInState,
  IDetailedBooking,
  ISimpleBooking
} from '~~/components/box-office/BoxOfficeSharedTypes';
import {
  useBoxOfficePerformanceBookingQuery,
  useBoxOfficePerformanceBookingsQuery
} from '~~/graphql/codegen/operations';

// Inject performance, provided by base box office page
const performance = inject(InjectionKeys.boxOffice.performance);

if (!performance)
  throw createSafeError('There was an issue loading this performance');

const checkInState = reactive<ICheckInState>({
  success: null,
  message: null
});

const autoCheckIn = ref(true);

const searchText = ref<string>('');
const searchFilter = ref<string | null>();
const searchOffset = ref(0);

const { result: bookingsQueryResult, loading: loadingBookings } =
  useBoxOfficePerformanceBookingsQuery(
    () => ({
      id: performance.id,
      search: searchText.value,
      offset: searchOffset.value,
      checkedIn: searchFilter.value === 'NOCHECKIN' ? false : null,
      discount: searchFilter.value === 'COMPS' ? 1 : null
    }),
    {
      debounce: 400,
      fetchPolicy: 'cache-and-network'
    }
  );

const bookings = computed(() =>
  bookingsQueryResult.value
    ? (bookingsQueryResult.value.performance?.bookings.edges
        .map((edge) => edge?.node)
        .filter((booking) => booking !== null) as ISimpleBooking[])
    : []
);

watch(loadingBookings, (newValue) => {
  if (newValue == true && !loadingSelectedBooking) {
    selectedBooking.value = undefined;
    setCheckInState();
  }
});

const { value: selectedBooking, loading: loadingSelectedBooking } =
  useQueryBasedState<IDetailedBooking>(
    'booking',
    (booking) => booking.id,
    async (identifier) => {
      const result = await waitForQuery(
        useBoxOfficePerformanceBookingQuery({
          bookingId: identifier,
          performanceId: performance.id
        })
      );
      return result.data.performance?.bookings.edges[0]?.node || undefined;
    }
  );

const queryTicketId = useQueryParam('ticket');

const selectedTicket = computed(() => {
  console.log(selectedBooking.value);
  return selectedBooking.value?.tickets?.find(
    (ticket) => ticket.id === queryTicketId.value
  );
});

function setCheckInState(
  success: boolean | null = null,
  message: string | null = null
) {
  checkInState.success = success ?? null;
  checkInState.message = message ?? null;
}
</script>
