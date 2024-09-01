<template>
  <div class="container">
    <h2 class="text-h2">Booking Tickets</h2>
    <NuxtLink
      class="btn p-2 bg-sta-green hover:bg-sta-green-dark rounded transition-colors mb-2"
      to="./"
    >
      View Full Booking
    </NuxtLink>

    <div
      class="grid gap-4 grid-cols-1 2xl:grid-cols-4 px-4 py-4 bg-sta-gray-dark sm:grid-cols-2 xl:grid-cols-3"
    >
      <ticket
        v-for="(ticket, index) in tickets"
        :key="index"
        :performance="performance"
        :ticket="ticket"
        :reference="reference"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import TicketClass from '~~/classes/Ticket';
import Ticket from '@/components/booking/Ticket.vue';
import {
  PerformanceByIdDocument,
  type PerformanceByIdQuery,
  type PerformanceByIdQueryVariables
} from '~~/graphql/codegen/operations';

definePageMeta({
  validate: (route) => {
    return !!(
      route.query.ticketID &&
      route.query.performanceID &&
      typeof route.query.performanceID == 'string' &&
      typeof route.params.reference == 'string'
    );
  }
});

const query = useRoute().query;
const reference = useRoute().params.reference as string;

const { data } = await useAsyncQuery<PerformanceByIdQuery>({
  query: PerformanceByIdDocument,
  variables: {
    id: query.performanceID as string
  } satisfies PerformanceByIdQueryVariables
});

const performance = data.value?.performance;

if (!performance) {
  throw navigateTo('./', { replace: true });
}
const tickets = (
  Array.isArray(query.ticketID) ? query.ticketID : [query.ticketID]
)
  .filter((ticketID) => typeof ticketID == 'string')
  .map((ticketID) => new TicketClass('', '', ticketID ?? ''));
</script>
