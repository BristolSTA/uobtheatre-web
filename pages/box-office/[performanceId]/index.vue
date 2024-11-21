<template>
  <BoxOfficeLayout>
    <div class="flex flex-col h-full overflow-hidden">
      <div
        class="flex-none flex flex-col md:flex-row items-center justify-center md:justify-between mt-5"
      >
        <BoxOfficeSellButton :performance-id="performance.id" />
        <BoxOfficeSchedule :performance="performance" class="hidden lg:block" />
        <BoxOfficeCheckInProgress
          class="w-60"
          :performance-id="performance.id"
        />
        <div class="flex flex-none gap-4 w-full md:w-auto">
          <BoxOfficeAutoCheckInControl
            v-model="autoCheckIn"
            class="hidden md:flex"
            positive-text-class="text-green-400"
            negative-text-class="text-red-400"
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
            :allow-mutations="
              selectedBooking?.performance?.id === performance.id
            "
            :bookings="bookings"
            :bookings-page-info="bookingsPaginationInfo"
            :loading-bookings="loadingBookings || loadingSelectedBooking"
            :performance-id="performance.id"
            @starting-check-in="setCheckInState()"
            @check-in-error="setCheckInState(false, $event)"
            @checked-in="setCheckInState(true, $event)"
            @un-checked-in="setCheckInState(undefined, $event)"
            @update:selected-ticket="queryTicketId = $event?.id"
            @update:bookings-offset="searchOffset = $event"
          />
        </div>
        <BoxOfficeScanStatus
          :state="checkInState"
          :show-indicator-always="autoCheckIn"
          class="bg-sta-gray-dark p-4 hidden md:block"
        />
      </div>
    </div>
  </BoxOfficeLayout>
</template>

<script lang="ts" setup>
import InjectionKeys from '@/utils/injection-keys';
import Ticket from '~~/classes/Ticket';
import { handleTicketScan } from '~~/services/ticketScanService';
import type {
  ICheckInState,
  IDetailedBooking,
  ISimpleBooking
} from '~~/types/box-office';
import {
  useBoxOfficePerformanceBookingQuery,
  useBoxOfficePerformanceBookingsQuery
} from '~~/graphql/codegen/operations';
import type { PaginationInfo } from '~~/types/generic';

// Inject performance, provided by base box office page
const performance = inject(InjectionKeys.boxOffice.performance);

if (!performance)
  throw createSafeError('There was an issue loading this performance');

const checkInState = reactive<ICheckInState>({
  success: null,
  message: null
});

const autoCheckIn = ref(true);

const scannedCode = useHardwareScanner(500, true);

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

const bookingsPaginationInfo = computed<PaginationInfo>(() => ({
  currentOffset: searchOffset.value,
  pageMaxLength: 10,
  hasNextPage:
    bookingsQueryResult.value?.performance?.bookings.pageInfo.hasNextPage ??
    false
}));

watch(loadingBookings, (newValue) => {
  if (newValue == true && !loadingSelectedBooking) {
    selectedBooking.value = undefined;
    setCheckInState();
  }
});

watch([searchText, searchFilter], () => {
  // When the search query changes, reset the offset (i.e. pagination) to be 0, and close current booking
  searchOffset.value = 0;
  selectedBooking.value = undefined;
  setCheckInState();
});

watch(scannedCode, async (newValue) => {
  // If the newly scaned code is undefined (i.e. telling us a new code is about to be scanned) reset the state
  if (!newValue) {
    setCheckInState();
    return;
  }

  try {
    // Convert the scanned text into ticket data
    const rawValue = JSON.parse(JSON.stringify(newValue[0])).rawValue;
    const ticketDetails = Ticket.dataFromQRCode(rawValue);

    // Do the scan action as appropriate
    let state = await handleTicketScan(
      autoCheckIn,
      performance.id,
      ticketDetails.bookingReference,
      ticketDetails.ticketId
    );

    // Update the booking and ticket information
    selectedBooking.value = state.booking;
    queryTicketId.value = state.ticket?.id;

    // Update the UI visual state
    setCheckInState(
      autoCheckIn.value
        ? !state.error
        : state.error !== undefined
          ? false
          : undefined,
      state.message ?? state.error
    );
  } catch (e) {
    silentErrorHandler(e);
    setCheckInState(false, 'Unable to read QR code');
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

watch(selectedBooking, (newValue) => {
  if (newValue === undefined) setCheckInState();
});

const queryTicketId = useQueryParam('ticket');

const selectedTicket = computed(() => {
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
