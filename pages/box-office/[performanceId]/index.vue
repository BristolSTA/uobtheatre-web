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

      <BoxOfficeCheckInStatus class="w-60" />
      <div class="flex flex-none gap-4 w-full md:w-auto">
        <div class="items-center gap-4 hidden md:flex">
          <UiInputToggle v-model="autoCheckIn" />
          <div class="flex flex-col items-center font-bold">
            <p class="text-white">Auto Check-In</p>
            <p class="text-sta-gray-lighter">
              {{ autoCheckIn ? 'Enabled' : 'Disabled' }}
            </p>
          </div>
        </div>
        <NuxtLink
          :href="`/box-office/${performance?.id}/sell`"
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

      <UiLoadingContainer
        :loading="loadingCheckin"
        class="flex-grow flex overflow-hidden gap-5"
      >
        <div class="w-1/3 hidden md:block">
          <BoxOfficeBookingTicketDetails
            v-if="inspectedObjects.ticket"
            :ticket="inspectedObjects.ticket"
            class="h-full overflow-y-auto"
            @check-in="
              inspectedObjects.booking
                ? checkInTickets(inspectedObjects.booking.reference, [
                    $event.id
                  ])
                : null
            "
            @un-check-in="
              inspectedObjects.booking
                ? unCheckInTickets(inspectedObjects.booking.reference, [
                    $event.id
                  ])
                : null
            "
          />
        </div>
        <div
          class="flex-grow bg-sta-gray-dark rounded-xl p-2 md:p-5 py-3 flex flex-col relative"
        >
          <UiLoadingContainer
            class="h-full"
            :loading="loadingBookings || loadingBooking"
            :hide-content-when-loading="true"
          >
            <div class="overflow-y-auto flex flex-col h-full">
              <BoxOfficeBookingInspector
                v-if="inspectedObjects.booking"
                :booking="inspectedObjects.booking"
                @select-ticket="selectTicket"
                @check-in-tickets="
                  inspectedObjects.booking
                    ? checkInTickets(
                        inspectedObjects.booking?.reference,
                        $event.map((ticket) => ticket.id)
                      )
                    : null
                "
                @close="closeBooking"
              />

              <BoxOfficeBookingList
                v-else
                :bookings="bookings"
                @select="selectBooking($event)"
              />
            </div>
          </UiLoadingContainer>
        </div>
      </UiLoadingContainer>
      <BoxOfficeDesktopCheckin :state="checkInState" class="hidden md:block" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import InjectionKeys from '@/utils/injection-keys';
import type { ICheckInIndicator } from '~~/components/box-office/BoxOfficeSharedTypes';
import {
  BoxOfficePerformanceBookingQuery,
  BoxOfficePerformanceBookingQueryVariables,
  BoxOfficePerformanceBookingsQuery,
  BoxOfficePerformanceBookingDocument,
  useBoxOfficePerformanceBookingsQuery,
  useCheckInBookingMutation,
  Scalars,
  useUnCheckInBookingMutation
} from '~~/graphql/codegen/operations';

// Inject performance, provided by base box office page
const performance = inject(InjectionKeys.boxOffice.performance);

if (!performance)
  throw createSafeError('There was an issue loading this performance');

const checkInState = reactive<ICheckInIndicator>({
  success: null,
  message: null
});

const autoCheckIn = ref(true);
const loadingBooking = ref(false);
const loadingCheckin = ref(false);

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

type SimpleBookings = NonNullable<
  NonNullable<
    NonNullable<
      BoxOfficePerformanceBookingsQuery['performance']
    >['bookings']['edges'][number]
  >['node']
>[];

const bookings = computed(() =>
  bookingsQueryResult.value
    ? (bookingsQueryResult.value.performance?.bookings.edges
        .map((edge) => edge?.node)
        .filter((booking) => booking !== null) as SimpleBookings)
    : []
);

watch(loadingBookings, (newValue) => {
  if (newValue == true) closeBooking();
});

type DeatiledBooking = NonNullable<
  NonNullable<
    NonNullable<
      BoxOfficePerformanceBookingQuery['performance']
    >['bookings']['edges'][number]
  >['node']
>;

type Ticket = NonNullable<NonNullable<DeatiledBooking['tickets']>[number]>;

const inspectedObjects = reactive<{
  booking?: DeatiledBooking;
  ticket?: Ticket;
}>({
  booking: undefined,
  ticket: undefined
});

// When the user selects a ticket
function selectTicket(selectedTicket: { id: string }) {
  inspectedObjects.ticket =
    inspectedObjects.booking!.tickets!.find(
      (ticket) => ticket.id == selectedTicket.id
    ) || undefined;
}

// When the user selects a booking
async function selectBooking(booking: SimpleBookings[number]) {
  if (!performance)
    return errorHandler(
      'No performance was available when running selectBooking'
    );
  loadingBooking.value = true;
  const { data } = await useAsyncQuery<BoxOfficePerformanceBookingQuery>({
    query: BoxOfficePerformanceBookingDocument,
    variables: {
      performanceId: performance.id,
      bookingId: booking.id
    } satisfies BoxOfficePerformanceBookingQueryVariables
  });
  loadingBooking.value = false;

  inspectedObjects.booking =
    data.value?.performance?.bookings.edges[0]?.node || undefined;
}

// Close any opened booking
function closeBooking() {
  inspectedObjects.booking = undefined;
  inspectedObjects.ticket = undefined;
  setCheckInState();
}

function setCheckInState(success?: boolean, message?: string) {
  checkInState.success = success ?? null;
  checkInState.message = message ?? null;
}

async function mutateTicketCheckInState(
  checkIn: boolean,
  bookingReference: string,
  ticketIds: Scalars['IdInputField'][]
) {
  loadingCheckin.value = true;
  setCheckInState();
  if (!performance)
    return errorHandler(
      'No performance was available when running mutateTicketCheckInState'
    );

  try {
    let data = undefined;

    // Deal with check in case
    if (checkIn) {
      data = await doMutation(
        useCheckInBookingMutation({
          variables: {
            performanceId: performance?.id,
            reference: bookingReference,
            tickets: ticketIds.map((ticketId) => ({
              ticketId
            }))
          }
        }),
        'checkInBooking'
      );
    } else {
      // Dela with un check in case
      data = await doMutation(
        useUnCheckInBookingMutation({
          variables: {
            performanceId: performance?.id,
            reference: bookingReference,
            tickets: ticketIds.map((ticketId) => ({
              ticketId
            }))
          }
        }),
        'uncheckInBooking'
      );
    }

    // Replace local booking
    if (inspectedObjects.booking && data.booking)
      inspectedObjects.booking = data.booking;

    // Replace local ticket
    if (ticketIds.length == 1) selectTicket({ id: ticketIds[0] });

    const tickets = ticketIds
      .map((ticketId) =>
        inspectedObjects.booking!.tickets!.find(
          (ticket) => ticket.id == ticketId
        )
      )
      .filter((ticket) => !!ticket);

    setCheckInState(
      checkIn ? true : undefined,
      ticketIds.length > 1
        ? checkIn
          ? 'Tickets checked in'
          : 'Tickets un-checked in'
        : checkIn
        ? `Checked In: 1x ${tickets[0]?.concessionType.name}`
        : `Un-Checked In: 1x ${tickets[0]?.concessionType.name}`
    );
  } catch (e) {
    const errors = getValidationErrors(e);
    setCheckInState(
      false,
      (
        errors?.allErrors
          .map((error) => error.message)
          .filter((message) => !!message) as string[]
      ).join(', ')
    );
  } finally {
    loadingCheckin.value = false;
  }
}

// Check in tickets
async function checkInTickets(
  bookingReference: string,
  ticketIds: Scalars['IdInputField'][]
) {
  mutateTicketCheckInState(true, bookingReference, ticketIds);
}

// Un Check in tickets
async function unCheckInTickets(
  bookingReference: string,
  ticketIds: Scalars['IdInputField'][]
) {
  mutateTicketCheckInState(false, bookingReference, ticketIds);
}
</script>
