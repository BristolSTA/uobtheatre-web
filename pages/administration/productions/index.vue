<template>
  <admin-page title="Your Productions">
    <template #toolbar>
      <sta-button
        class="bg-sta-green hover:bg-sta-green-dark transition-colors"
        to="productions/create"
        >Start New Draft</sta-button
      >
    </template>
    <div class="flex flex-wrap gap-3 items-end md:flex-nowrap">
      <div>
        <t-input
          v-model="productionSearchFilter"
          placeholder="Search by name"
        />
      </div>
      <div>
        <label>Status</label
        ><t-select
          v-model="productionsStatusFilter"
          :options="[
            { value: null, text: 'All' },
            { value: 'DRAFT', text: 'Draft' },
            { value: 'PUBLISHED', text: 'Published' },
            { value: 'CLOSED', text: 'Closed' },
            { value: 'COMPLETE', text: 'Complete' },
          ]"
        />
      </div>
      <div>
        <label>Run Date</label>
        <t-datepicker v-model="productionsRunDateFilter" class="text-black" />
      </div>
    </div>
    <card class="mt-6">
      <paginated-table
        :items="
          productionsData ? productionsData.edges.map((edge) => edge.node) : []
        "
        :max-per-page="10"
        :loading="$apollo.queries.productionsData.loading"
        :offset.sync="productionsOffset"
        :page-info="productionsData ? productionsData.pageInfo : {}"
      >
        <template #head>
          <table-head-item>Status</table-head-item>
          <table-head-item>Name</table-head-item>
          <table-head-item>Society</table-head-item>
          <table-head-item>Dates</table-head-item>
        </template>
        <template #default="slotProps">
          <table-row
            v-for="(production, index) in slotProps.items"
            :key="index"
          >
            <table-row-item
              ><production-status-badge :production="production"
            /></table-row-item>
            <table-row-item>
              <nuxt-link
                :to="`/administration/productions/${production.slug}`"
                class="text-sta-orange hover:text-sta-orange-dark font-semibold"
                >{{ production.name }}</nuxt-link
              >
            </table-row-item>
            <table-row-item>{{ production.society.name }}</table-row-item>
            <table-row-item>
              {{
                production.start && production.end
                  ? displayStartEnd(production.start, production.end, 'd MMMM')
                  : ''
              }}
            </table-row-item>
          </table-row>
        </template>
      </paginated-table></card
    >
  </admin-page>
</template>

<script>
import PaginatedTable from '@/components/ui/Tables/PaginatedTable.vue'
import AdminProductionsQuery from '@/graphql/queries/admin/productions/AdminProductionsIndex.gql'
import { displayStartEnd } from '@/utils'
import TableHeadItem from '@/components/ui/Tables/TableHeadItem.vue'
import TableRow from '@/components/ui/Tables/TableRow.vue'
import TableRowItem from '@/components/ui/Tables/TableRowItem.vue'
import Card from '@/components/ui/Card.vue'
import ProductionStatusBadge from '@/components/production/ProductionStatusBadge.vue'
import AdminPage from '@/components/admin/AdminPage.vue'
import StaButton from '@/components/ui/StaButton.vue'
export default {
  components: {
    PaginatedTable,
    TableHeadItem,
    TableRowItem,
    Card,
    TableRow,
    ProductionStatusBadge,
    AdminPage,
    StaButton,
  },
  data() {
    return {
      productionsData: null,
      productionsOffset: 0,
      productionsStatusFilter: null,
      productionsRunDateFilter: null,
      productionSearchFilter: null,
    }
  },
  head: {
    title: 'Your Productions',
  },
  methods: {
    displayStartEnd,
  },
  apollo: {
    productionsData: {
      query: AdminProductionsQuery,
      variables() {
        return {
          offset: this.productionsOffset,
          status: this.productionsStatusFilter,
          startLte: this.productionsRunDateFilter
            ? this.productionsRunDateFilter + 'T23:59:59'
            : null,
          endGte: this.productionsRunDateFilter
            ? this.productionsRunDateFilter + 'T00:00:00'
            : null,
          search: this.productionSearchFilter,
        }
      },
      update: (data) => data.productions,
    },
  },
}
</script>
