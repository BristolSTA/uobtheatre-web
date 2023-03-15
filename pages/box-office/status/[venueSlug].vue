<template>
  <div class="flex h-screen w-screen bg-sta-gray-dark text-white font-mono">
    <UiLoadingContainer
      :loading="loadingPerformance"
      :hide-content-when-loading="true"
      class="flex-grow"
    >
      <div v-if="performance" class="flex flex-col gap-y-20">
        <div class="text-5xl">
          <table class="w-full text-center">
            <thead>
              <tr>
                <th
                  v-for="(category, i) in Object.keys(ticketSalesDetails)"
                  :key="i"
                >
                  {{ category }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  v-for="(value, i) in Object.values(ticketSalesDetails)"
                  :key="i"
                >
                  {{ value }}
                </td>
              </tr>
            </tbody>
          </table>
          <table class="w-full text-center">
            <thead>
              <tr>
                <th
                  v-for="(category, i) in Object.keys(checkInDetails)"
                  :key="i"
                >
                  {{ category }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  v-for="(value, i) in Object.values(checkInDetails)"
                  :key="i"
                >
                  {{ value }}
                </td>
              </tr>
            </tbody>
          </table>
          <BoxOfficeSchedule :performance="performance" />
        </div>
      </div>
      <div v-else class="flex items-center justify-center h-full text-6xl">
        No Performance
      </div>
    </UiLoadingContainer>
  </div>
</template>

<script lang="ts" setup>
import {
  useBoxOfficePerformanceQuery,
  useBoxOfficePerformanceTicketBreakdownQuery,
  useVenueUpcomingProductionsQuery
} from '~~/graphql/codegen/operations';
import { productionsOnNow } from '~~/utils/production';

definePageMeta({
  layout: false
});

const route = useRoute();
const now = useClock(60 * 60);

const venueSlug = route.params.venueSlug;

if (typeof venueSlug !== 'string')
  throw createSafeError({
    statusCode: 400,
    message: 'Only a single venue is supported'
  });
const { result: venueProductionsData, loading: loadingPerformance } =
  useVenueUpcomingProductionsQuery(
    () => ({
      slug: venueSlug,
      now: now.value.toISO(),
      nowDate: now.value.toISODate()
    }),
    {
      pollInterval: 60 * 60 * 1000 // Every hour
    }
  );

const performance = computed(() => {
  const rawProductionNodes =
    venueProductionsData.value?.venue?.productions?.edges
      .map((edge) => edge?.node)
      .filter(isNonNullable);

  if (!rawProductionNodes) return undefined;

  const productions = productionsOnNow(rawProductionNodes, {
    minutesBefore: 60,
    now
  });
  return productions[0]?.performances.edges[0]?.node;
});

const { result: performanceData } = useBoxOfficePerformanceQuery(
  () => ({
    id: performance?.value?.id ?? ''
  }),
  () => ({
    enabled: !!performance.value
  })
);
const { result: ticketData } = useBoxOfficePerformanceTicketBreakdownQuery(
  () => ({
    id: performance?.value?.id ?? ''
  }),
  () => ({
    enabled: !!performance.value
  })
);

const ticketSalesDetails = computed(() => ({
  'Tickets Sold':
    ticketData.value?.performance?.ticketsBreakdown.totalTicketsSold,
  'Tickets Unsold':
    ticketData.value?.performance?.ticketsBreakdown.totalTicketsAvailable,
  'Tickets Capacity':
    ticketData.value?.performance?.ticketsBreakdown.totalCapacity
}));

const checkInDetails = computed(() => ({
  'Tickets Collected':
    ticketData.value?.performance?.ticketsBreakdown.totalTicketsCheckedIn,
  'Tickets To Collect':
    ticketData.value?.performance?.ticketsBreakdown.totalTicketsToCheckIn
}));
</script>
