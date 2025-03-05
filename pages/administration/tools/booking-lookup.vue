<template>
  <AdminPage title="Bookings Lookup">
    <div class="flex items-end space-x-4">
      <div>
        <label>User</label>
        <UiInputText v-model="user" placeholder="Filter by user" />
      </div>
      <div>
        <label>Search By Booking Creator</label>
        <UiInputToggle v-model="searchByCreator" />
      </div>
      <div>
        <!-- Show the productions filter if we have any. -->
        <label>Production</label>
        <UiInputSelect
          v-if="
            !$apollo.queries.productions.loading &&
            productions.length > 0 &&
            productions.length <= 5
          "
          v-model="productionSlug"
          nullify-value="performanceId"
          :options="productions"
        />
        <!-- If our productions are loading, have a greyed out text box -->
        <UiInputText
          v-else-if="$apollo.queries.productions.loading"
          v-model="productionName"
          disabled="true"
          placeholder="Filter by production"
        />
        <!-- Otherwise, show a text box -->
        <UiInputText
          v-else
          v-model="productionName"
          placeholder="Filter by production"
        />
      </div>
      <div>
        <!-- Show the performances filter if we have any for a selected
        production. If not, disable the filter.-->
        <label>Performance</label>
        <UiInputSelect
          v-if="
            productionSlug &&
            !$apollo.queries.performances.loading &&
            performances.length > 0 &&
            !disablePerformanceDropdown
          "
          v-model="performanceId"
          :options="performances"
        />
        <UiInputSelect
          v-else
          v-model="performanceId"
          :disabled="true"
          :options="[{ displayText: 'All', value: null }]"
        />
      </div>
      <div>
        <label>Status</label>
        <UiInputSelect
          v-model="bookingsStatus"
          :options="[
            { displayText: 'All', value: null },
            { displayText: 'In Progress', value: 'IN_PROGRESS' },
            { displayText: 'Paid', value: 'PAID' },
            { displayText: 'Refunded', value: 'REFUNDED' },
            { displayText: 'Locked', value: 'LOCKED' },
            { displayText: 'Cancelled', value: 'CANCELLED' }
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
        <template #head>
          <table-head-item>Name</table-head-item>
          <table-head-item>Quantity</table-head-item>
          <table-head-item>Production</table-head-item>
          <table-head-item>
            Date<sort-icon
              v-model="bookingsOrderBy"
              :must-sort="false"
              sort-field="start"
            />
          </table-head-item>
          <table-head-item>Time</table-head-item>
          <table-head-item>Status</table-head-item>
          <table-head-item>
            Created<sort-icon
              v-model="bookingsOrderBy"
              :must-sort="true"
              sort-field="-createdAt"
            />
          </table-head-item>
        </template>

        <table-row
          v-for="booking in bookings"
          :key="booking.reference"
          :striped="true"
          :clickable="true"
          @click="
            useRouter().push(
              `../productions/${booking.performance.production.slug}/bookings/${booking.reference}`
            )
          "
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
            {{ booking.performance.production.name }}
          </table-row-item>
          <table-row-item>
            {{ dateFormat(booking.performance.start, 'dd MMM y') }}
          </table-row-item>
          <table-row-item>
            {{ dateFormat(booking.performance.start, 'HH:mm ZZZZ') }}
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
import AdminBookingsQuery from '~/graphql/queries/admin/bookings/AdminBookingsIndex.gql';
import AdminProductionsQuery from '~/graphql/queries/admin/productions/AdminProductionsIndex.gql';
import AdminPerformancesIndex from '~/graphql/queries/admin/productions/AdminPerformancesIndex.gql';

import PaginatedTable from '@/components/ui/Tables/PaginatedTable.vue';
import TableHeadItem from '@/components/ui/Tables/TableHeadItem.vue';
import TableRow from '@/components/ui/Tables/TableRow.vue';
import TableRowItem from '@/components/ui/Tables/TableRowItem.vue';

import SortIcon from '@/components/ui/SortIcon.vue';

import BookingStatusEnum from '~~/enums/PayableStatusEnum';
import { dateFormat, duration } from '@/utils/datetime';

export default defineNuxtComponent({
  components: {
    PaginatedTable,
    TableHeadItem,
    TableRow,
    TableRowItem,

    SortIcon
  },
  async asyncData() {
    const { data } = await useDefaultApolloClient().query({
      query: AdminBookingsQuery
    });

    return data.bookings;
  },
  data() {
    return {
      bookings: [],
      bookingsPageInfo: {},
      bookingsOffset: 0,
      bookingsOrderBy: null,
      bookingsStatus: null,
      disablePerformanceDropdown: true,
      oldSlug: null,
      performances: [],
      performanceId: null,
      productions: [],
      productionName: null,
      productionSlug: null,
      user: null,
      searchByCreator: false,
      creatorSearch: null,

      BookingStatusEnum
    };
  },

  apollo: {
    bookings: {
      query: AdminBookingsQuery,
      variables() {
        // alert(`${JSON.stringify(this.productions)}`);
        // If switching production, we need to nullify the performanceID to
        // stop errors
        if (this.productionSlug !== this.oldSlug) {
          this.performanceId = null;
          // Also set the performances to be loading, so as to disable that
          // dropdown until they've actually loaded (which will have to wait
          // until after this request has completed).
          this.disablePerformanceDropdown = true;

          // If we're going from a production slug to the "all" value (i.e. null),
          // we should nullify the production name search field too
          if (!this.productionSlug) {
            this.productionName = null;
            this.oldSlug = null;
          }
        }
        return {
          offset: this.bookingsOffset,
          // Only have one production slug or production search query
          oldSlug: this.oldSlug,
          productionSlug: this.productionSlug,
          productionSearch: this.productionSlug ? null : this.productionName,
          performanceId: this.performanceId,
          userSearch: !this.searchByCreator ? this.user : null,
          creatorSearch: this.searchByCreator ? this.user : null,
          orderBy: this.bookingsOrderBy,
          status: this.bookingsStatus
        };
      },
      fetchPolicy: 'cache-and-network',
      update(data) {
        const bookings = data.bookings.edges;
        if (!bookings.length) {
          return [];
        }
        return bookings.map((edge) => edge.node);
      },
      debounce: 600,
      result(result) {
        if (!result.data) {
          return;
        }
        this.bookingsPageInfo = result.data.bookings.pageInfo;
      }
    },
    productions: {
      query: AdminProductionsQuery,
      variables() {
        return { search: this.productionName };
      },
      fetchPolicy: 'cache-and-network',
      update(data) {
        const productions = data.productions.edges;
        if (!productions.length) {
          return [];
        }
        return productions.map((edge) => edge.node);
      },
      debounce: 600,
      result(result) {
        if (!result.data) {
          return;
        }

        // Get the list of all productions
        // Sort the productions alphabetically by name
        let prodArray =
          // Get the productions
          result.data.productions.edges
            .map((edge) => edge.node)
            // Sort these productions alphabetically by name
            .sort((a, b) => a.name.localeCompare(b.name))
            // Convert the name of each production into an option for a UIInputSelect
            .map((node) => {
              let option = {};
              option.displayText = node.name;
              option.value = node.slug;
              return option;
            });

        // Create an empty option, which shows all productions,
        // only if we have more than one production
        if (prodArray.length > 0) {
          let emptyOption = {};
          emptyOption.displayText = 'All';
          emptyOption.value = null;

          prodArray.unshift(emptyOption);
        }

        this.productions = prodArray;
      }
    },
    performances: {
      query: AdminPerformancesIndex,
      variables() {
        return { productionSlug: this.productionSlug };
      },
      fetchPolicy: 'cache-and-network',
      update(data) {
        const performances = data.production.performances.edges;
        if (!performances.length) {
          return [];
        }
        return performances.map((edge) => edge.node);
      },
      debounce: 600,
      result(result) {
        if (!result.data) {
          return;
        }

        // Get the list of performances for the selected production
        // Sort the performances by time
        let perfArray =
          // Get the performances
          result.data.production.performances.edges
            .map((edge) => edge.node)
            // Sort the performances by time, based on the start times
            .sort((a, b) => duration(a.start, b.start).as('milliseconds'))
            // Convert each performance node into an option for a UIInputSelect
            .map((node) => {
              let option = {};
              option.displayText = dateFormat(
                node.start,
                'dd MMM y - HH:mm ZZZZ'
              );
              option.value = node.id;
              return option;
            });

        // Create an empty option, which shows all performances
        let emptyOption = {};
        emptyOption.displayText = 'All';
        emptyOption.value = null;

        perfArray.unshift(emptyOption);

        this.performances = perfArray;

        // We use this so that if we switch from one production to another,
        // we remember to nullify the performanceID to stop errors
        this.oldSlug = this.productionSlug;
        this.disablePerformanceDropdown = false;
      },
      skip() {
        return !this.productionSlug;
      }
    }
  },

  methods: { dateFormat, duration }
});
</script>
