<template>
  <div class="container">
    <div class="sm:py-6">
      <overview
        :production="performance.production"
        :performance="performance"
        :detailed="false"
      />
    </div>
    <div class="flex justify-center my-4">
      <div class="w-full px-1 py-2 sm:p-2 lg:w-3/4 bg-sta-gray-dark">
        <h2 class="flex justify-center mb-2 text-2xl">Complimentary Tickets</h2>
        <table class="w-full table-auto">
          <tbody>
            <tr
              v-for="(box, index) in [1, 2, 3]"
              :key="index"
              class="odd:bg-sta-gray-light even:bg-sta-gray"
            >
              <td class="px-4 py-2 text-xl font-semibold hover:text-gray-300">
                Name
              </td>
              <td class="px-4"><span class="font-mono">0/3</span> Collected</td>
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
import Overview from '@/components/box-office/Overview.vue'

export default {
  components: { Overview },
  props: {
    performance: {
      required: true,
      type: Object,
    },
  },
  computed: {
    crumbs() {
      return [
        { text: 'Box Office', route: '/box-office' },
        {
          text: `${
            this.performance.production.name
          } on ${this.$options.filters.dateFormat(
            this.performance.start,
            'ccc dd MMM T'
          )}`,
          route: `/box-office/${this.performance.id}`,
        },
        {
          text: 'Collect or Check',
        },
      ]
    },
  },
}
</script>
