<template>
  <div>
    <div class="container">
      <div class="py-1 sm:py-6">
        <overview
          :production="performance.production"
          :performance="performance"
          :detailed="false"
        />
      </div>
      <nuxt-child
        :performance="performance"
        :booking="booking"
        :ticket-matrix="ticketMatrix"
        @next-stage="onNextStage"
      />
    </div>
  </div>
</template>

<script>
import TicketsMatrix from '@/classes/TicketsMatrix'
import FullProductionAndTicketOptions from '@/graphql/queries/FullProductionAndTicketOptions.gql'
import Booking from '@/classes/Booking'
import Overview from '@/components/box-office/Overview.vue'
export default {
  components: { Overview },
  middleware: 'authed',
  async asyncData({ params, app, error }) {
    const { data } = await app.apolloProvider.defaultClient.query({
      query: FullProductionAndTicketOptions,
      variables: {
        id: params.performanceId,
      },
      fetchPolicy: 'no-cache',
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
  computed: {
    crumbs() {
      return [
        { text: 'Box Office', path: '/box-office' },
        {
          text: `${
            this.performance.production.name
          } on ${this.$options.filters.dateFormat(
            this.performance.start,
            'ccc dd MMM T'
          )}`,
          path: `/box-office/${this.performance.id}`,
        },
        {
          text: 'Sell Tickets',
        },
      ]
    },
  },
  methods: {
    onNextStage() {
      this.detailed = false
      this.$router.push(`/box-office/${this.performance.id}/sell/pay`)
    },
  },
}
</script>
