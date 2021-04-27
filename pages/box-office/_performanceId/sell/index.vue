<template>
  <div>
    <div class="bg-sta-gray-light">
      <div class="sm:container">
        <breadcrumbs :crumbs="crumbs" />
      </div>
    </div>
    <div class="container">
      <div class="sm:py-6">
        <overview
          :production="performance.production"
          :performance="performance"
        />
      </div>
      <div v-if="performance" class="p-2 my-2 text-white bg-sta-gray-dark">
        <div v-if="ticketMatrix" class="space-y-1">
          <ticket-options :ticket-matrix="ticketMatrix" :booking="booking" />
        </div>
        <all-errors-display
          :errors="errors"
          class="p-2 text-center bg-sta-gray-dark"
        />
        <div v-if="booking.tickets.length" class="flex my-4">
          <selected-tickets-table
            :ticket-matrix="ticketMatrix"
            :booking="booking"
          />
        </div>
        <div v-if="booking.tickets.length" class="mt-2 text-center">
          <button
            class="font-semibold btn btn-orange"
            :disabled="booking.dirty"
            @click="$emit('next-stage')"
            @keypress="$emit('next-stage')"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import lo from 'lodash'

import FullProductionAndTicketOptions from '@/graphql/queries/FullProductionAndTicketOptions.gql'
import Booking from '@/classes/Booking'
import TicketsMatrix from '@/classes/TicketsMatrix'
import TicketOptions from '@/components/booking/TicketOptions.vue'
import SelectedTicketsTable from '@/components/booking/SelectedTicketsTable.vue'
import Overview from '@/components/box-office/Overview.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import AllErrorsDisplay from '@/components/ui/AllErrorsDisplay.vue'

export default {
  components: {
    TicketOptions,
    SelectedTicketsTable,
    Overview,
    Breadcrumbs,
    AllErrorsDisplay,
  },
  middleware: 'authed',
  async asyncData({ params, app, error }) {
    const { data } = await app.apolloProvider.defaultClient.query({
      query: FullProductionAndTicketOptions,
      variables: {
        id: params.performanceId,
      },
    })

    const performance = data.performance
    if (!performance)
      return error({
        statusCode: 404,
        message: 'This performance does not exist',
      })

    const ticketMatrix = new TicketsMatrix(performance)

    const booking = new Booking()
    booking.performance = performance

    return {
      ticketMatrix,
      performance,
      booking,
    }
  },
  data() {
    return {
      booking: null,
      ticketMatrix: null,
      performance: null,
      selected_location_index: null,

      //   interaction_timer: lo.debounce(this.updateAPI, 2 * 1000),
      errors: null,
    }
  },
  computed: {
    crumbs() {
      return [
        { text: 'Box Office', route: '/box-office' },
        {
          text: `${this.performance.production.name} on day X`,
          route: `/box-office/${this.performance.id}`,
        },
        {
          text: 'Sell Tickets',
        },
      ]
    },
  },
}
</script>
