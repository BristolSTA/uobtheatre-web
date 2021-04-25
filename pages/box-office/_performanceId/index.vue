<template>
  <div class="min-h-full bg-sta-gray">
    <div class="bg-sta-gray-light">
      <div class="sm:container">
        <breadcrumbs :crumbs="crumbs" />
      </div>
    </div>
    <div class="sm:container">
      <div class="sm:py-10">
        <overview
          :production="performance.production"
          :performance="performance"
        />
      </div>
      <div class="flex flex-wrap justify-center">
        <menu-tile
          v-for="(box, index) in navItems"
          :key="index"
          :route="`/box-office/${performance.id}/all-bookings`"
          :icon="box.icon"
          :name="box.name"
          class="w-full mb-4 md:mr-4 bg-sta-green hover:bg-sta-orange md:w-1/3 lg:w-1/4 2xl:w-1/5"
        />
      </div>
      <hr class="border-t-2 border-sta-gray-dark" />
      <div class="flex justify-center my-4">
        <div class="w-full px-1 py-2 sm:p-2 lg:w-3/4 bg-sta-gray-dark">
          <h2 class="flex justify-center mb-2 text-2xl">
            Complimentary Tickets
          </h2>
          <table class="w-full table-auto">
            <tbody>
              <tr
                v-for="(box, index) in navItems"
                :key="index"
                class="odd:bg-sta-gray-light even:bg-sta-gray"
              >
                <td class="px-4 py-2 text-xl font-semibold hover:text-gray-300">
                  Name
                </td>
                <td class="px-4">0 / 3 Collected</td>
                <td class="px-4 text-right">
                  <div>
                    <button
                      class="w-8 h-8 p-0 m-1 rounded-md btn"
                      :class="[
                        !numTickets ? 'btn-rouge btn-outline' : 'btn-orange',
                      ]"
                      :disabled="!numTickets"
                      @click="minusTicket"
                      @keypress="minusTicket"
                    >
                      -
                    </button>
                    <button
                      class="w-8 h-8 p-0 m-1 rounded-md btn"
                      :class="[
                        maxAddAllowed < 1
                          ? 'btn-rouge btn-outline'
                          : 'btn-orange',
                      ]"
                      :disabled="maxAddAllowed < 1"
                      @click="addTicket"
                      @keypress="addTicket"
                    >
                      +
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="flex justify-center mt-2">
            <button class="m-2 btn btn-rouge btn-outline">Cancel</button>
            <button class="m-2 btn btn-green">Confim</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BoxOfficePerformance from '@/graphql/queries/BoxOfficePerformance.gql'
import Overview from '@/components/box-office/Overview.vue'
import MenuTile from '@/components/box-office/MenuTile.vue'
// import Booking from '@/components/box-office/Booking.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'

export default {
  components: { Overview, MenuTile, Breadcrumbs },
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
      performance: null,
      navItems: [
        {
          name: 'Check or Collect Tickets',
          icon: 'user-check',
        },
        {
          name: 'Sell Tickets',
          icon: 'cash-register',
        },
        {
          name: 'View Bookings',
          icon: 'clipboard-list',
        },
      ],
    }
  },
  head() {
    return {
      title: `${this.performance.production.name} Box Office`,
    }
  },
  computed: {
    crumbs() {
      return [
        { text: 'Box Office', route: '/box-office' },
        {
          text: `${this.performance.production.name} on day X`,
          // TODO fix the date/time here
        },
      ]
    },
  },
}
</script>
