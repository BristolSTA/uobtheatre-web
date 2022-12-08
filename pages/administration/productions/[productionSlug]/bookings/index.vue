<template>
  <AdminPage :title="`${production.name} Bookings`">
    <div class="flex items-end space-x-4">
      <div><UiInputText v-model="bookingsSearch" placeholder="Search" /></div>
      <div>
        <label>Status</label
        ><UiInputSelect
          v-model="bookingsStatus"
          :options="[
            { displayText: 'All', value: null },
            { displayText: 'In Progress', value: 'IN_PROGRESS' },
            { displayText: 'Paid', value: 'PAID' }
          ]"
        />
      </div>
    </div>
    <UiCard class="mt-4">
      <paginated-table
        v-model:offset="bookingsOffset"
        :page-info="bookingsPageInfo"
        :items="bookings"
        :max-per-page="10"
        :loading="$apollo.queries.bookings.loading"
        empty-text="No matching bookings found"
      >
        <template #head>
          <table-head-item>Name</table-head-item>
          <table-head-item>Reference</table-head-item>
          <table-head-item>Quantity</table-head-item>
          <table-head-item>Status</table-head-item>
          <table-head-item>
            Created<sort-icon
              v-model="bookingsOrderBy"
              :must-sort="true"
              sort-field="createdAt"
            />
          </table-head-item>
        </template>

        <table-row
          v-for="booking in bookings"
          :key="booking.reference"
          :striped="true"
          :clickable="true"
          @click="$router.push(`bookings/${booking.reference}`)"
        >
          <table-row-item>
            {{ booking.user.firstName }}
            {{ booking.user.lastName }}
            <p v-if="booking.creator.id !== booking.user.id" class="text-xs">
              Created by {{ booking.creator.firstName }}
              {{ booking.creator.lastName }}
            </p>
          </table-row-item>
          <table-row-item>{{ booking.reference }}</table-row-item>
          <table-row-item>
            {{ booking.tickets.length }} ticket{{
              booking.tickets.length > 1 ? 's' : ''
            }}
          </table-row-item>
          <table-row-item>
            {{ new BookingStatusEnum(booking.status).name }}
          </table-row-item>
          <table-row-item>
            {{ dateFormat(booking.createdAt, 'dd/MMM/y HH:mm ZZZZ') }}
          </table-row-item>
        </table-row>
      </paginated-table>
    </UiCard>
  </AdminPage>
</template>

<script>
import AdminProductionCompleteBookingsQuery from '@/graphql/queries/admin/productions/AdminProductionCompleteBookings.gql';

import PaginatedTable from '@/components/ui/Tables/PaginatedTable.vue';
import TableHeadItem from '@/components/ui/Tables/TableHeadItem.vue';
import TableRow from '@/components/ui/Tables/TableRow.vue';
import TableRowItem from '@/components/ui/Tables/TableRowItem.vue';

import SortIcon from '@/components/ui/SortIcon.vue';
import AdminProductionLookupQuery from '@/graphql/queries/admin/productions/AdminProductionLookup.gql';
import BookingStatusEnum from '~~/enums/PayableStatusEnum';
import { dateFormat } from '@/utils/datetime';
export default defineNuxtComponent({
  components: {
    PaginatedTable,
    TableHeadItem,
    TableRow,
    TableRowItem,

    SortIcon
  },
  async asyncData() {
    // Execute query
    const { data } = await useDefaultApolloClient().query({
      query: AdminProductionLookupQuery,
      variables: {
        slug: useRoute().params.productionSlug
      }
    });

    const production = data.production;
    if (!production) {
      throw createError({
        statusCode: 404,
        message: 'This production does not exist'
      });
    }
    return {
      production
    };
  },
  data() {
    return {
      bookings: [],
      bookingsPageInfo: {},
      bookingsOffset: 0,
      bookingsSearch: null,
      bookingsOrderBy: null,
      bookingsStatus: null,

      production: null,

      BookingStatusEnum
    };
  },
  apollo: {
    bookings: {
      query: AdminProductionCompleteBookingsQuery,
      variables() {
        return {
          productionSlug: this.production.slug,
          performanceId: this.$route.query.performanceId,
          offset: this.bookingsOffset,
          search: this.bookingsSearch,
          orderBy: this.bookingsOrderBy,
          status: this.bookingsStatus
        };
      },
      fetchPolicy: 'cache-and-network',
      update(data) {
        const performances = data.production.performances.edges;
        if (!performances.length) {
          return [];
        }
        return performances[0].node.bookings.edges.map((edge) => edge.node);
      },
      debounce: 600,
      result(result) {
        if (!result.data) {
          return;
        }
        this.bookingsPageInfo =
          result.data.production.performances.edges[0].node.bookings.pageInfo;
      }
    }
  },
  methods: {
    dateFormat
  }
});
</script>
