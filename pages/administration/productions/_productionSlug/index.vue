<template>
  <admin-page :title="production.name">
    <template #toolbar>
      <sta-button
        colour="green"
        icon="link"
        :to="`/production/${production.slug}`"
        >View Public Page</sta-button
      >
      <sta-button
        v-if="canEdit"
        colour="orange"
        icon="edit"
        :to="`${production.slug}/edit`"
        >Edit</sta-button
      >
    </template>
    <div class="space-y-4">
      <div class="flex flex-wrap justify-around space-y-4">
        <card title="Summary" class="max-w-2xl">
          <table class="table-auto w-full">
            <tr>
              <table-head-item>Status</table-head-item>
              <table-row-item>
                <production-status-badge :production="production" />
                <p class="text-sm">{{ statusDescription }}</p>
              </table-row-item>
            </tr>
            <tr>
              <table-head-item>Society</table-head-item>
              <table-row-item> {{ production.society.name }} </table-row-item>
            </tr>
            <tr v-if="production.totalCapacity && production.salesBreakdown">
              <table-head-item>Ticket Sales</table-head-item>
              <table-row-item>
                {{ production.totalTicketsSold }} of
                {{ production.totalCapacity }} ({{
                  Math.floor(
                    (100 * production.totalTicketsSold) /
                      production.totalCapacity
                  )
                }}%)
                <progress-bar
                  :percentage="
                    (100 * production.totalTicketsSold) /
                    production.totalCapacity
                  "
                />
              </table-row-item>
            </tr>
            <tr v-if="production.salesBreakdown">
              <table-head-item>Sales Total</table-head-item>
              <table-row-item
                >£{{
                  (production.salesBreakdown.totalSales / 100).toFixed(2)
                }}</table-row-item
              >
            </tr>
            <tr v-if="production.salesBreakdown">
              <table-head-item>Total Society Revenue</table-head-item>
              <table-row-item
                >£{{
                  (production.salesBreakdown.societyRevenue / 100).toFixed(2)
                }}</table-row-item
              >
            </tr>
          </table>
        </card>
        <div>
          <card v-if="actions.length" title="Actions" class="max-w-2xl">
            <div class="flex gap-2">
              <sta-button
                v-for="(action, index) in actions"
                :key="index"
                class="bg-sta-orange hover:bg-sta-orange-dark mt-3"
                :class="action.class"
                :icon="action.icon"
                @click="action.action()"
                >{{ action.text }}</sta-button
              >
            </div>
          </card>
        </div>
      </div>
      <card title="Performances">
        <template v-if="canEdit" #messageBox>
          <nuxt-link
            class="hover:text-gray-200"
            :to="`${production.slug}/performances/create`"
            ><font-awesome-icon icon="plus-circle" class="fa-2x"
          /></nuxt-link>
        </template>
        <paginated-table
          :items="
            performancesData
              ? performancesData.edges.map((edge) => edge.node)
              : []
          "
          :max-per-page="10"
          :loading="$apollo.queries.performancesData.loading"
          :page-info="performancesData ? performancesData.pageInfo : {}"
          :offset.sync="performancesOffset"
        >
          <template #head>
            <table-head-item></table-head-item>
            <table-head-item>Date</table-head-item>
            <table-head-item>Doors Time</table-head-item>
            <table-head-item>Venue</table-head-item>
            <table-head-item>Sales</table-head-item>
            <table-head-item></table-head-item>
          </template>
          <template #default="slotProps">
            <table-row
              v-for="performance in slotProps.items"
              :key="performance.id"
            >
              <table-row-item>
                <performance-status-badge :performance="performance" />
              </table-row-item>
              <table-row-item>{{
                performance.start | dateFormat('EEEE dd MMMM y')
              }}</table-row-item>
              <table-row-item>{{
                performance.doorsOpen | dateFormat('HH:mm ZZZZ')
              }}</table-row-item>
              <table-row-item>{{ performance.venue.name }}</table-row-item>
              <table-row-item>
                <template v-if="performance.ticketsBreakdown.totalCapacity">
                  <p>
                    {{ performance.ticketsBreakdown.totalTicketsSold }} of
                    {{ performance.ticketsBreakdown.totalCapacity }} ({{
                      salesPercentage(performance)
                    }}%)
                  </p>
                  <progress-bar
                    :height="2"
                    :percentage="parseInt(salesPercentage(performance))"
                  />
                </template>
              </table-row-item>
              <table-row-item class="space-x-2">
                <sta-button
                  :small="true"
                  colour="green"
                  :to="`/administration/productions/${production.slug}/performances/${performance.id}`"
                  >View</sta-button
                >
              </table-row-item>
            </table-row>
          </template>
        </paginated-table>
      </card>
    </div>
  </admin-page>
</template>

<script>
import AdminProductionShowQuery from '@/graphql/queries/admin/productions/AdminProductionShow.gql'
import AdminPerformancesIndexQuery from '@/graphql/queries/admin/productions/AdminPerformancesIndex.gql'
import AdminPage from '@/components/admin/AdminPage.vue'
import StaButton from '@/components/ui/StaButton.vue'
import Card from '@/components/ui/Card.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import PerformanceStatusBadge from '@/components/performance/PerformanceStatusBadge.vue'
import TableRowItem from '@/components/ui/Tables/TableRowItem.vue'
import TableHeadItem from '@/components/ui/Tables/TableHeadItem.vue'
import ProductionStatusBadge from '@/components/production/ProductionStatusBadge.vue'
import PaginatedTable from '@/components/ui/Tables/PaginatedTable.vue'
import TableRow from '@/components/ui/Tables/TableRow.vue'
import {
  getValidationErrors,
  performMutation,
  successToast,
  swal,
} from '@/utils'

export default {
  components: {
    AdminPage,
    StaButton,
    Card,
    ProgressBar,
    PerformanceStatusBadge,
    TableRowItem,
    TableHeadItem,
    ProductionStatusBadge,
    PaginatedTable,
    TableRow,
  },
  async asyncData({ params, error, app }) {
    // Execute query
    const { data } = await app.apolloProvider.defaultClient.query({
      query: AdminProductionShowQuery,
      variables: {
        slug: params.productionSlug,
      },
      fetchPolicy: 'no-cache',
    })

    const production = data.production
    if (!production)
      return error({
        statusCode: 404,
        message: 'This production does not exist',
      })
    return {
      production,
    }
  },
  data() {
    return {
      production: null,

      performancesData: null,
      performancesOffset: 0,
    }
  },
  apollo: {
    performancesData: {
      query: AdminPerformancesIndexQuery,
      variables() {
        return {
          productionSlug: this.production.slug,
          offset: this.performancesOffset,
        }
      },
      update: (data) => data.production.performances,
      fetchPolicy: 'cache-and-network',
    },
  },
  head() {
    const productionName = this.production ? this.production.name : 'Loading...'
    return {
      title: productionName,
    }
  },
  computed: {
    statusDescription() {
      if (this.production.status.description === 'Draft')
        return 'This production is private, and not bookable'
      if (this.production.status.description === 'Submitted')
        return 'This production has been submitted for review'
      if (this.production.status.description === 'Published')
        return 'This production is being displayed publically'
      if (this.production.status.description === 'Closed')
        return 'This production has been closed, and it no longer accepting bookings'
      if (this.production.status.description === 'Complete')
        return 'This production has been completed, and income has been transfered to the society'

      return null
    },
    canEdit() {
      return this.production.permissions.includes('edit_production')
    },
    actions() {
      const list = []
      list.push({
        icon: 'list-ul',
        action: () =>
          this.$router.push(
            `/administration/productions/${this.production.slug}/permissions`
          ),
        text: 'Edit Permissions',
      })

      if (this.canEdit) {
        if (this.production.status.value === 'DRAFT') {
          list.push({
            icon: 'user-check',
            action: () => this.setStatus('PENDING'),
            text: 'Submit for Review',
          })
        }
        if (
          this.production.status.value === 'PENDING' &&
          this.production.permissions.includes('approve_production')
        ) {
          list.push({
            icon: 'check',
            action: () => this.setStatus('APPROVED'),
            text: 'Approve',
          })
        }
        if (this.production.status.value === 'APPROVED') {
          list.push({
            icon: 'globe',
            class: 'animate-pulse animate',
            action: () => this.setStatus('PUBLISHED'),
            text: 'Make Live',
          })
        }
        if (
          this.production.status.value === 'PUBLISHED' &&
          new Date(this.production.end) < new Date() &&
          this.production.permissions.includes('force_change_production')
        ) {
          list.push({
            icon: 'times-circle',
            action: () => this.setStatus('CLOSED'),
            text: 'Close Production',
          })
        }
      }

      return list
    },
  },
  methods: {
    salesPercentage(performance) {
      return Math.floor(
        (100 * performance.ticketsBreakdown.totalTicketsSold) /
          performance.ticketsBreakdown.totalCapacity
      )
    },
    async setStatus(status) {
      const { isConfirmed } = await swal.fire({
        title: 'Are you sure?',
        text: `Are you sure you want to change the status to '${status}'`,
        showCancelButton: true,
        showConfirmButton: true,
      })
      if (!isConfirmed) return

      try {
        await performMutation(
          this.$apollo,
          {
            mutation: require('@/graphql/mutations/admin/production/SetProductionStatus.gql'),
            variables: {
              id: this.production.id,
              status,
            },
          },
          'setProductionStatus'
        )
      } catch (e) {
        const errors = getValidationErrors(e)
        swal.fire({
          title: 'There was an issue',
          html: errors.allErrors
            .map((error) => `<p>${error.message}</p>`)
            .join(''),
        })
        return
      }
      await this.$nuxt.refresh()
      successToast.fire({ title: 'Status updated' })
    },
  },
}
</script>
