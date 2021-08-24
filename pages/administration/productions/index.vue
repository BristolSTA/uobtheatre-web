<template>
  <div>
    <h1 class="text-h1">Your Productions</h1>
    <div class="flex items-end space-x-4">
      <div><t-input placeholder="Search by name" /></div>
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
        v-if="productionsData"
        :items="productionsData.edges.map((edge) => edge.node)"
        :loading="$apollo.queries.productionsData.loading"
        :offset.sync="productionsOffset"
        :page-info="productionsData.pageInfo"
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
                :to="`productions/${production.slug}`"
                class="font-semibold text-sta-orange hover:text-sta-orange-dark"
                >{{ production.name }}</nuxt-link
              >
            </table-row-item>
            <table-row-item>{{ production.society.name }}</table-row-item>
            <table-row-item>
              {{ displayStartEnd(production.start, production.end, 'd MMMM') }}
            </table-row-item>
          </table-row>
        </template>
      </paginated-table></card
    >
  </div>
</template>

<script>
import PaginatedTable from '@/components/ui/Tables/PaginatedTable.vue'
import AdminProductionsQuery from '@/graphql/queries/admin/AdminProductionsIndex.gql'
import { displayStartEnd } from '@/utils'
import TableHeadItem from '@/components/ui/Tables/TableHeadItem.vue'
import TableRow from '@/components/ui/Tables/TableRow.vue'
import TableRowItem from '@/components/ui/Tables/TableRowItem.vue'
import Card from '@/components/ui/Card.vue'
import ProductionStatusBadge from '@/components/production/ProductionStatusBadge.vue'
export default {
  components: {
    PaginatedTable,
    TableHeadItem,
    TableRowItem,
    Card,
    TableRow,
    ProductionStatusBadge,
  },
  data() {
    return {
      productionsData: null,
      productionsOffset: 0,
      productionsStatusFilter: null,
      productionsRunDateFilter: null,
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
        }
      },
      update: (data) => data.productions,
    },
  },
}
</script>
