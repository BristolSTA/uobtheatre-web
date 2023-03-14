<template>
  <div class="flex h-screen w-screen bg-sta-gray-dark text-white">
    <UiLoadingContainer
      :loading="loadingPerformance"
      :hide-content-when-loading="true"
      class="flex-grow"
    >
      <div v-if="performance">
        <table>
          <thead>
            <tr>
              <th>Tickets Sold</th>
            </tr>
            <tr>
              <th>Tickets Unsold</th>
            </tr>
            <tr>
              <th>Total Capacity</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <BoxOfficeSchedule :performance="performance" />
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
      now: now.value.toISOTime()
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
  return productions[0].performances.edges[0]?.node;
});

const { result: performanceData } = useBoxOfficePerformanceQuery(
  {
    id: performance?.value?.id ?? ''
  },
  {
    enabled: !!performance.value
  }
);
const { result: ticketData } = useBoxOfficePerformanceTicketBreakdownQuery(
  {
    id: performance?.value?.id ?? ''
  },
  {
    enabled: !!performance.value
  }
);

const ticketSalesDetails = computed(() => ({
  'Tickets Sold': 0,
  'Tickets Unsold': 0,
  'Tickets Capacity': 0
}));

const checkInDetails = computed(() => ({
  'Tickets Collected': 0,
  'Tickets To Collect': 0
}));
</script>
