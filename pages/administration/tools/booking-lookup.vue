<template>
  <AdminPage title="Bookings Lookup">
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
          empty-text="No bookings found"
      >
        <!--//TODO:Add sorting-->
        <template #head>
          <table-head-item>Name</table-head-item>
          <table-head-item>Quantity</table-head-item>
          <table-head-item>Production</table-head-item>
          <table-head-item>Date</table-head-item>
          <table-head-item>Time</table-head-item>
          <table-head-item>Status</table-head-item>
          <table-head-item>Created</table-head-item>
        </template>

        <table-row
            v-for="booking in bookings"
            :key="booking.reference"
            :striped="true"
            :clickable="true"
            @click="useRouter().push(`../productions/${booking.performance.production.slug}/bookings/${booking.reference}`)"
        >
          <table-row-item>
            {{ booking.user.firstName }}
            {{ booking.user.lastName }}
            <p v-if="booking.creator.id !== booking.user.id" class="text-xs">
              Created by {{ booking.creator.firstName }}
              {{ booking.creator.lastName }}
            </p>
          </table-row-item>
          <table-row-item>
            {{ booking.tickets.length }} ticket{{
              booking.tickets.length > 1 ? 's' : ''
            }}
          </table-row-item>
          <table-row-item>
            {{ booking.performance.production.name}}
          </table-row-item>
          <table-row-item>
            {{dateFormat(booking.performance.start, 'dd MMM y') }}
          </table-row-item>
          <table-row-item>
            {{dateFormat(booking.performance.start, 'HH:mm ZZZZ') }}
          </table-row-item>
          <table-row-item>
            {{ new BookingStatusEnum(booking.status).name }}
          </table-row-item>
          <table-row-item>
            {{ dateFormat(booking.createdAt, 'dd MMM y HH:mm ZZZZ') }}
          </table-row-item>
        </table-row>
      </paginated-table>
    </UiCard>
  </AdminPage>
</template>

<script>
import AdminBookingsQuery from
      '~/graphql/queries/admin/bookings/AdminBookingsIndex.gql';

import PaginatedTable from '@/components/ui/Tables/PaginatedTable.vue';
import TableHeadItem from '@/components/ui/Tables/TableHeadItem.vue';
import TableRow from '@/components/ui/Tables/TableRow.vue';
import TableRowItem from '@/components/ui/Tables/TableRowItem.vue';

import SortIcon from '@/components/ui/SortIcon.vue';

import BookingStatusEnum from '~~/enums/PayableStatusEnum';
import { dateFormat } from '@/utils/datetime';

export default defineNuxtComponent(
    {
  components: {
    PaginatedTable,
    TableHeadItem,
    TableRow,
    TableRowItem,

    SortIcon
  },
  async asyncData() {
    // window.alert("inAsyncDataFunction");
    // Execute query to get all bookings
    const { data } = await useDefaultApolloClient().query({
      query: AdminBookingsQuery,
    });

    // window.alert(JSON.stringify(data));

   return data.bookings;
  },
  data() {
    // window.alert("in data function");
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
      query: AdminBookingsQuery,
      variables() {
        // window.alert("In variables");
        // window.alert(JSON.stringify(this.bookings));
        return {
          bookings:this.bookings
        };
      },
      fetchPolicy: 'cache-and-network',
      update(data) {
        // window.alert("In update");
        // window.alert(JSON.stringify(data.bookings));
        const bookings = data.bookings.edges;
        if (!bookings.length) {
          return [];
        }
        return bookings.map((edge) => edge.node);
      },
      debounce: 600,
      result(result) {
        // window.alert("In result");
        // window.alert(JSON.stringify(result.data));
        if (!result.data) {
          return;
        }
        this.bookingsPageInfo =
            result.data.bookings.pageInfo;
      }
    }
  },

  methods: {
    dateFormat
  }
});
</script>
