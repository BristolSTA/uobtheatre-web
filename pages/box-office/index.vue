<template>
  <div class="sm:container">
    <div class="sm:py-10">
      <overview
        :production="production"
        :performance="production.performances.edges[0].node"
      />
    </div>
    <div class="flex flex-wrap justify-center">
      <div
        v-for="(box, index) in data"
        :key="index"
        class="w-full p-2 md:w-1/3 lg:w-1/4 2xl:w-1/5"
      >
        <div class="w-full h-full p-4 bg-sta-green hover:bg-sta-orange">
          <menu-tile route="/box-office" :icon="box.icon" :name="box.name">
            <template #description>A description</template>
          </menu-tile>
        </div>
      </div>
    </div>
    <hr class="border-t-2 border-sta-gray-dark" />
    <div class="flex justify-center my-4">
      <div class="w-full px-1 py-2 sm:p-2 lg:w-3/4 bg-sta-gray-dark">
        <h2 class="flex justify-center mb-2 text-2xl">Complimentary Tickets</h2>
        <table class="w-full table-auto">
          <tbody>
            <tr
              v-for="(box, index) in data"
              :key="index"
              class="odd:bg-sta-gray-light even:bg-sta-gray"
            >
              <td class="px-4 py-2 text-xl font-semibold hover:text-gray-300">
                {{ box.person }}
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
</template>

<script>
import ProductionPageQuery from '@/graphql/queries/ProductionBySlug.gql'
import Overview from '@/components/box-office/Overview.vue'
// import IconListItem from '@/components/ui/IconListItem.vue'
import MenuTile from '@/components/box-office/MenuTile.vue'

export default {
  name: 'BoxOffice',
  components: { Overview, MenuTile },
  async asyncData({ params, error, app }) {
    // Execute query
    const { data } = await app.apolloProvider.defaultClient.query({
      query: ProductionPageQuery,
      variables: {
        slug: 'legally-blonde',
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
      data: [
        {
          name: 'Sell Tickets',
          icon: 'cash-register',
          person: 'James',
        },
        {
          name: 'Comp Tickets',
          icon: 'ticket-alt',
          person: 'Toof',
        },
        {
          name: 'View All Bookings',
          icon: 'clipboard-list',
          person: 'Tomm',
        },
      ],
    }
  },
}
</script>
