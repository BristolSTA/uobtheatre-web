<template>
  <div class="min-h-full bg-sta-gray">
    <div class="container">
      <production-banner
        class="pb-2 md:pb-8"
        :production="production"
        :show-buy-tickets-button="false"
        :show-detailed-info="false"
      />
      <div class="flex flex-wrap mb-2 md:space-x-2 md:flex-nowrap">
        <booking-navigation
          class="hidden md:flex md:w-1/4 md:flex-none"
          :current-stage-index="currentStageIndex"
          :production="production"
          :booking="booking"
          @goto-stage="navigateToStage"
        />
        <div v-if="currentStage" class="w-full mb-1 text-center md:hidden">
          <h1 class="text-h1 text-sta-green">{{ currentStage.name }}</h1>
          <clickable-link
            v-if="currentStageIndex > 0"
            class="text-white"
            @click="gotoPreviousStage"
          >
            <font-awesome-icon icon="chevron-left" />Back
          </clickable-link>
        </div>
        <div
          id="booking-view"
          class="flex-grow max-w-full p-1 pb-4 sm:p-3 bg-sta-gray-dark"
        >
          <NuxtChild
            ref="stageComponent"
            :production="production"
            :booking="booking"
            :ticket-matrix="ticketMatrix"
            @hook:mounted="onChildMount"
            @select-performance="onSelectPerformance"
            @next-stage="navigateToStage()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Booking from '@/classes/Booking'
import TicketsMatrix from '@/classes/TicketsMatrix'
import BookingNavigation from '@/components/booking/BookingNavigation.vue'
import ProductionBanner from '@/components/production/ProductionBanner.vue'
import ClickableLink from '@/components/ui/ClickableLink.vue'
import { swal } from '@/utils'

import ProductionBasicInfoFragment from '@/graphql/fragments/production/ProductionBasicInfoFragment.gql'
import ProductionPerformancesFragment from '@/graphql/fragments/production/ProductionPerformancesFragment.gql'
import gql from 'graphql-tag'
import {
  getNextStage,
  getPreviousStage,
  getStageIndex,
} from './book/-bookingStages'
export default {
  components: {
    BookingNavigation,
    ProductionBanner,
    ClickableLink,
  },
  middleware: 'authed',
  async asyncData({ params, app, error }) {
    const { data } = await app.apolloProvider.defaultClient.query({
      query: gql`
        query production($slug: String!) {
          production(slug: $slug) {
            ...ProductionBasicInfo
            ...ProductionPerformances
          }
        }
        ${ProductionBasicInfoFragment}
        ${ProductionPerformancesFragment}
      `,
      variables: {
        slug: params.slug,
      },
    })

    const production = data.production
    if (!production)
      return error({
        statusCode: 404,
        message: 'This production does not exists',
      })
    return {
      production,
    }
  },
  data() {
    return {
      booking: new Booking(),
      ticketMatrix: null,
      previousBooking: null,
      currentStage: null,
    }
  },
  head() {
    return {
      title: `Book ${this.production.name}`,
      script: [{ src: this.$config.services.square.script, defer: true }],
    }
  },
  computed: {
    currentStageIndex() {
      return getStageIndex(this.currentStage)
    },
    crumbs() {
      return [
        { text: 'Whats On', route: '/productions' },
        {
          text: this.production.name,
          route: `/production/${this.production.slug}`,
        },
        { text: 'Book' },
      ]
    },
  },
  methods: {
    onChildMount() {
      this.currentStage = this.$refs.stageComponent.$options.stageInfo

      this.loadDataForStage()
      if (!this.currentStage.shouldBeUsed(this.production, this.booking)) {
        return this.navigateToStage()
      }
      if (!this.currentStage.eligable(this.production, this.booking)) {
        return this.gotoPreviousStage()
      }
    },
    gotoPreviousStage() {
      this.navigateToStage(
        getPreviousStage(this.currentStageIndex, this.production, this.booking)
      )
    },
    navigateToStage(stage = null) {
      if (!stage)
        stage = getNextStage(
          this.currentStageIndex,
          this.production,
          this.booking
        )

      this.$router.push({
        name: stage.stageInfo.routeName,
        hash: '#booking-view',
        params: {
          slug: this.production.slug,
          performanceId: this.booking.performance
            ? this.booking.performance.id
            : null,
        },
      })
    },
    loadDataForStage() {
      if (this.$route.params.performanceId) {
        // Check if user already has a draft booking for this performnace if not already
        if (this.previousBooking === null) {
          this.$apollo
            .query({
              query: require('@/graphql/queries/DraftBookingForPerformance.gql'),
              variables: {
                performanceID: this.$route.params.performanceId,
              },
              fetchPolicy: 'no-cache',
            })
            .then(({ data }) => {
              this.previousBooking = data.me.bookings.edges.length
                ? data.me.bookings.edges[0].node
                : false

              if (this.previousBooking) {
                swal
                  .fire({
                    title: 'Resume previous booking?',
                    text:
                      'You previously started a booking for this performance. Would you like to resume it?',
                    showCancelButton: true,
                    confirmButtonText: 'Resume',
                    cancelButtonText: 'No, start fresh',
                  })
                  .then((result) => {
                    if (result.isConfirmed) {
                      this.booking.updateFromAPIData(this.previousBooking)
                    }
                  })
              }
            })
        }

        if (!this.booking.performance) {
          this.booking.performance = this.production.performances.edges
            .map((edge) => edge.node)
            .find(
              (performance) =>
                performance.id === this.$route.params.performanceId
            )
        }

        if (!this.ticketMatrix) {
          this.$apollo
            .query({
              query: require('@/graphql/queries/PerformanceTicketOptions.gql'),
              variables: {
                id: this.booking.performance.id,
              },
            })
            .then((result) => {
              this.ticketMatrix = new TicketsMatrix(result.data.performance)
            })
        }
      }
    },
    onSelectPerformance(performance) {
      this.booking.performance = performance
      this.booking.tickets = []
      this.navigateToStage()
    },
  },
}
</script>
