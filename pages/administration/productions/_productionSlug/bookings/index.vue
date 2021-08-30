<template>
  <admin-page :title="`${production.name} Bookings`">
    <div class="flex items-end space-x-4">
      <div><t-input v-model="bookingsSearch" placeholder="Search" /></div>
      <div>
        <label>Status</label
        ><t-select :options="['All', 'In Progress', 'Paid', 'Refunded']" />
      </div>
      <div>
        <label>Date</label>
        <t-datepicker :clearable="false" class="text-black" />
      </div>
    </div>
    <card class="mt-4">
      <paginated-table
        :page-info="bookingsPageInfo"
        :offset.sync="bookingsOffset"
        :items="bookings"
        :loading="$apollo.queries.bookings.loading"
        empty-text="No matching bookings found"
      >
        <template #head>
          <table-head-item>Name</table-head-item>
          <table-head-item>Reference</table-head-item>
          <table-head-item>Quantity</table-head-item>
          <table-head-item>Status</table-head-item>
          <table-head-item
            >Created<sort-icon
              v-model="bookingsOrderBy"
              :must-sort="true"
              sort-field="createdAt"
          /></table-head-item>
        </template>

        <table-row
          v-for="booking in bookings"
          :key="booking.reference"
          :striped="true"
          :clickable="true"
          @click="$router.push(`bookings/${booking.reference}`)"
        >
          <table-row-item
            >{{ booking.user.firstName }}
            {{ booking.user.lastName }}
            <p v-if="booking.creator.id !== booking.user.id" class="text-xs">
              Created by {{ booking.creator.firstName }}
              {{ booking.creator.lastName }}
            </p>
          </table-row-item>
          <table-row-item>{{ booking.reference }}</table-row-item>
          <table-row-item
            >{{ booking.tickets.length }} ticket{{
              booking.tickets.length > 1 ? 's' : ''
            }}</table-row-item
          >
          <table-row-item>{{ booking.status.description }}</table-row-item>
          <table-row-item>{{
            booking.createdAt | dateFormat('dd/MMM/y HH:mm ZZZZ')
          }}</table-row-item>
        </table-row>
      </paginated-table>
    </card>
  </admin-page>
</template>

<script>
import AdminProductionCompleteBookingsQuery from '@/graphql/queries/admin/productions/AdminProductionCompleteBookings.gql'
import AdminPage from '@/components/admin/AdminPage.vue'
import PaginatedTable from '@/components/ui/Tables/PaginatedTable.vue'
import TableHeadItem from '@/components/ui/Tables/TableHeadItem.vue'
import TableRow from '@/components/ui/Tables/TableRow.vue'
import TableRowItem from '@/components/ui/Tables/TableRowItem.vue'
import Card from '@/components/ui/Card.vue'
import SortIcon from '@/components/ui/SortIcon.vue'
import AdminProductionLookupQuery from '@/graphql/queries/admin/productions/AdminProductionLookup.gql'
export default {
  components: {
    AdminPage,
    PaginatedTable,
    TableHeadItem,
    TableRow,
    TableRowItem,
    Card,
    SortIcon,
  },
  async asyncData({ params, error, app }) {
    // Execute query
    const { data } = await app.apolloProvider.defaultClient.query({
      query: AdminProductionLookupQuery,
      variables: {
        slug: params.productionSlug,
      },
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
      bookings: [],
      bookingsPageInfo: {},
      bookingsOffset: 0,
      bookingsSearch: null,
      bookingsOrderBy: null,

      production: null,
    }
  },
  head() {
    const title = `Bookings for ${this.production.name}`
    return {
      title,
    }
  },
  apollo: {
    bookings: {
      query: AdminProductionCompleteBookingsQuery, // TODO: This query requires changing once API is ready
      variables() {
        return {
          productionSlug: this.production.slug,
          performanceId: this.$route.query.performanceId,
          offset: this.bookingsOffset,
          search: this.bookingsSearch,
          orderBy: this.bookingsOrderBy,
        }
      },
      update(data) {
        const performances = data.production.performances.edges
        if (!performances.length) return []
        return performances[0].node.bookings.edges.map((edge) => edge.node)
      },
      debounce: 600,
      result(result) {
        this.bookingsPageInfo =
          result.data.production.performances.edges[0].node.bookings.pageInfo
      },
    },
  },
}
</script>
