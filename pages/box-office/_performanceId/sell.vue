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
        :booking.sync="booking"
        :ticket-matrix="ticketMatrix"
        @next-stage="onNextStage"
      />
    </div>
  </div>
</template>

<script>
import TicketsMatrix from '@/classes/TicketsMatrix'
import FullPerformanceAndTicketOptions from '@/graphql/queries/FullPerformanceAndTicketOptions.gql'
import BoxOfficePerformanceBooking from '@/graphql/queries/box-office/BoxOfficePerformanceBooking.gql'
import Booking from '@/classes/Booking'
import Overview from '@/components/box-office/Overview.vue'
export default {
  components: { Overview },
  middleware: 'authed',
  async asyncData ({ params, app, error }) {
    const { data } = await app.apolloProvider.defaultClient.query({
      query: FullPerformanceAndTicketOptions,
      variables: {
        id: params.performanceId
      },
      fetchPolicy: 'no-cache'
    })

    const performance = data.performance
    if (!performance) {
      return error({
        statusCode: 404,
        message: 'This performance does not exist'
      })
    }

    const ticketMatrix = new TicketsMatrix(performance)

    const booking = new Booking()
    booking.performance = performance

    return {
      ticketMatrix,
      performance,
      booking
    }
  },
  data () {
    return {
      booking: null
    }
  },
  computed: {
    inProgressID () {
      return this.$store.state['box-office'].inProgressBookingID
    },
    crumbs () {
      return [
        { text: 'Box Office', path: '/box-office' },
        {
          text: `${
            this.performance.production.name
          } on ${this.$options.filters.dateFormat(
            this.performance.start,
            'ccc dd MMM T'
          )}`,
          path: `/box-office/${this.performance.id}`
        },
        {
          text: 'Sell Tickets'
        }
      ]
    }
  },
  watch: {
    inProgressID (newVal) {
      if (newVal) { this.loadExistingBookingData() } else {
        this.booking = new Booking()
        this.booking.performance = this.performance
      }
    }
  },
  mounted () {
    this.loadExistingBookingData()
  },
  methods: {
    async loadExistingBookingData () {
      if (!this.inProgressID) { return }
      const { data } = await this.$apollo.query({
        query: BoxOfficePerformanceBooking,
        variables: {
          performanceId: this.performance.id,
          bookingId: this.inProgressID
        },
        fetchPolicy: 'no-cache'
      })
      if (
        data.performance.bookings.edges.length &&
        !data.performance.bookings.edges[0].node.expired &&
        data.performance.bookings.edges[0].node.status === 'IN_PROGRESS'
      ) {
        this.booking.updateFromAPIData(data.performance.bookings.edges[0].node)
      } else {
        // Remove stored booking ID
        this.$store.commit('box-office/SET_IN_PROGRESS_BOOKING_ID', null)
      }
    },
    onNextStage () {
      this.detailed = false
      this.$router.push(`/box-office/${this.performance.id}/sell/pay`)
    }
  }
}
</script>
