<template>
  <div class="min-h-full bg-sta-gray">
    <div class="bg-sta-gray-light">
      <div class="sm:container">
        <breadcrumbs :crumbs="crumbs" />
      </div>
    </div>
    <div class="sm:container">
      <div class="sm:py-6">
        <overview
          :production="performance.production"
          :performance="performance"
          :detailed="false"
        />
      </div>
      <div class="flex justify-center mb-4">
        <div class="w-full px-1 py-2 sm:p-2 lg:w-3/4 bg-sta-gray-dark">
          <h2 class="flex justify-center mb-2 text-2xl">All Bookings</h2>
          <div>
            <booking
              v-for="index in 5"
              :key="index"
              :expanded="selected_booking_index == index"
              :index="index"
              @select-booking="
                selected_booking_index =
                  selected_booking_index != index ? index : null
              "
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BoxOfficePerformance from '@/graphql/queries/BoxOfficePerformance.gql'

import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import Overview from '@/components/box-office/Overview.vue'
import Booking from '@/components/box-office/Booking.vue'

export default {
  components: { Overview, Booking, Breadcrumbs },
  props: {},
  async asyncData({ params, error, app }) {
    // Execute query
    const { data } = await app.apolloProvider.defaultClient.query({
      query: BoxOfficePerformance,
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
    return {
      performance,
    }
  },
  data() {
    return {
      selected_booking_index: null,
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
          text: 'All Bookings',
        },
      ]
    },
  },
}
</script>
