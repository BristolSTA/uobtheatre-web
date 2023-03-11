<template>
  <div>
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
    <BoxOfficeSchedule />
  </div>
</template>

<script type="ts" setup>
import { useBoxOfficePerformanceQuery, useBoxOfficePerformanceTicketBreakdownQuery, useVenueUpcomingProductionsQuery } from '~~/graphql/codegen/operations';
import { productionsOnNow } from '~~/utils/production';


const route = useRoute()

const { result: venueProductionsData } = useVenueUpcomingProductionsQuery(() => ({
  slug: route.params.venueSlug,
  now: DateTime.now()
}), {
  pollInterval: 60 * 60 * 1000 // Every hour
})

const performance = computed(() => {
  const productions = productionsOnNow(venueProductionsData.value.venue.productions, { minutesBefore: 60 })
  return productions[0].performances.edges[0].node
})

const { result: performanceData } = useBoxOfficePerformanceQuery({ id: route.params.venueId })
const {result: ticketData} = useBoxOfficePerformanceTicketBreakdownQuery({id: p})


const ticketSalesDetails = computed(() => ({
    "Tickets Sold": 0,
    "Tickets Unsold": 0,
    "Tickets Capacity": 0,
}))

const checkInDetails = computed(() => ({
    "Tickets Collected": 0,
    "Tickets To Collect": 0,
}))
</script>
