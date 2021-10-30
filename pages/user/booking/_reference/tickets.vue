<template>
  <div class="container">
    <h2 class="text-h2">Booking Tickets</h2>
    <nuxt-link
      class="
        btn
        p-2
        bg-sta-green
        hover:bg-sta-green-dark
        rounded
        transition-colors
        mb-2
      "
      to="./"
      >View Full Booking</nuxt-link
    >

    <div
      class="
        grid
        gap-4
        grid-cols-1
        2xl:grid-cols-4
        px-4
        py-4
        bg-sta-gray-dark
        sm:grid-cols-2
        xl:grid-cols-3
      "
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

<script>
import TicketClass from '@/classes/Ticket'
import Ticket from '@/components/booking/Ticket.vue'
export default {
  components: { Ticket },
  async asyncData({ app, params, error, query, redirect }) {
    if (!query.ticketID || !query.performanceId) return redirect('./')
    const { data } = await app.apolloProvider.defaultClient.query({
      query: require('@/graphql/queries/performance/PerformanceById.gql'),
      variables: {
        id: query.performanceId,
      },
    })

    if (!data.performance) return redirect('./')
    const tickets = (
      Array.isArray(query.ticketID) ? query.ticketID : [query.ticketID]
    ).map((ticketID) => new TicketClass(null, null, ticketID))

    return {
      performance: data.performance,
      reference: params.reference,
      tickets,
    }
  },
}
</script>
