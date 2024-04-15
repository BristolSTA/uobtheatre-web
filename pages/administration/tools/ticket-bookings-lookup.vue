<template>
  <AdminPage title="Tickets & Bookings">
    <div class="flex items-end space-x-4">
      <div>
        <label>User</label>
        <UiInputText
            v-model="userSearch"
                     placeholder="Filter by user" />
      </div>
      <div>
        <!-- Show the productions filter if we have any. If not, disable the
        filter.-->
        <label>Production</label>
        <UiInputSelect
            v-if="!$apollo.queries.productions.loading && productions.length
            > 0"
            v-model="bookingsSearch"
            :options="productions"
        />
        <UiInputSelect
            v-else
            v-model="bookingsSearch"
            :disabled="true"
            :options="[
            { displayText: 'All', value: null }]"
        />
      </div>
      <div>
        <label>Status</label>
        <UiInputSelect
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

    <div class="space-y-2" />
        <h1 class="text-h1">Check by Barcode</h1>
    <div class="space-y-2" />
    <div v-if="!scannedData">
      <div v-if="!useCameraScanner" class="text-center">
        <h3 class="text-h3">Scan a ticket with a barcode scanner</h3>
        <p>or</p>
        <UiStaButton colour="orange" @click="useCameraScanner = true"
        >Scan With Camera</UiStaButton
        >
      </div>
      <UiInputTicketScanner
          v-else
          @scanned="onScan($event.ticketData)"
          @invalid-code="onInvalidCode"
      />
    </div>
    <div v-else class="space-y-2">
      <h2 class="text-h2">Scanned Details</h2>
      Booking Reference: {{ scannedData.bookingReference }} | Ticket ID:
      {{ scannedData.ticketId }}
      <p>
        <UiStaButton colour="orange" @click="scannedData = undefined"
        >Scan Again</UiStaButton
        >
        <UiStaButton
            v-if="bookingInfo"
            class="ml-4"
            colour="green"
            :to="`/administration/productions/${bookingInfo.performance.production.slug}/bookings/${bookingInfo.reference}`"
        >View Booking</UiStaButton
        >
      </p>
      <div class="flex flex-wrap gap-4 lg:flex-nowrap lg:space-y-0">
        <div class="flex-grow">
          <UiCard v-if="ticket" title="Ticket">
            <BoxOfficeBookingTicketDetails :ticket="ticket" />
          </UiCard>
        </div>
        <div class="flex-grow">
          <UiCard v-if="bookingInfo" title="Booking">
            <BoxOfficeBookingDetails
                :booking="bookingInfo"
                :allow-ticket-inspections="false"
            />
          </UiCard>
        </div>
      </div>
    </div>
  </AdminPage>
</template>

<script>
// Bookings Table
import AdminBookingsQuery from
      '~/graphql/queries/admin/bookings/AdminBookingsIndex.gql';
import AdminProductionsQuery from '~/graphql/queries/admin/productions/AdminProductionsIndex.gql'

import PaginatedTable from '@/components/ui/Tables/PaginatedTable.vue';
import TableHeadItem from '@/components/ui/Tables/TableHeadItem.vue';
import TableRow from '@/components/ui/Tables/TableRow.vue';
import TableRowItem from '@/components/ui/Tables/TableRowItem.vue';

import SortIcon from '@/components/ui/SortIcon.vue';

import BookingStatusEnum from '~~/enums/PayableStatusEnum';
import { dateFormat } from '@/utils/datetime';

// Ticket Scanner
import { errorToast } from "~~/utils/alerts"
import { handleTicketScan } from "~~/services/ticketScanService"

const ticket = ref()
const bookingInfo = ref()
const scannedData = ref()
const useCameraScanner = ref(false)

// Code for Ticket Scanner
const hardwareScannedDetails = useHardwareTicketScanner()

watch(hardwareScannedDetails.ticketDetails, newVal => {
  if (!newVal) return

  onScan(newVal)
})

watch(hardwareScannedDetails.isInvalid, newVal => {
  if (!newVal) return

  onInvalidCode()
})

function onInvalidCode() {
  errorToast.fire({
    title: "Invalid ticket QR code scanned"
  })
}

async function onScan(ticketData) {
  scannedData.value = ticketData
  bookingInfo.value = undefined

  const response = await handleTicketScan(
      false,
      undefined,
      scannedData.value.bookingReference,
      [scannedData.value.ticketId]
  )
  bookingInfo.value = response.booking
  ticket.value = response.ticket

  if (!bookingInfo.value) {
    return errorToast.fire({
      title: "A matching booking does not exist for this reference"
    })
  }
}

// Booking Table Component
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
        const { data } = await useDefaultApolloClient().query({
          query: AdminBookingsQuery,
        });

        return data.bookings;
      },
      data() {
        return {
          bookings: [],
          productions: [],
          bookingsPageInfo: {},
          bookingsOffset: 0,
          bookingsSearch: null,
          userSearch: null,
          bookingsOrderBy: null,
          bookingsStatus: null,

          BookingStatusEnum
        };
      },

      apollo: {
        bookings: {
          query: AdminBookingsQuery,
          variables() {
            return {
              offset: this.bookingsOffset,
              productionSearch: this.bookingsSearch,
              userSearch: this.userSearch,
              orderBy: this.bookingsOrderBy,
              status: this.bookingsStatus,
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
            this.bookingsPageInfo =
                result.data.bookings.pageInfo;
          }
        },
        productions: {
          query: AdminProductionsQuery,
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

            // Get the list of productions from the visible bookings
            // Sort the productions alphabetically by name
            let prodArray =
                // Get the productions
                result.data.productions.edges.map((edge) => edge.node.name)
                    .sort()
                    // Convert the name of each production into an option for a UIInputSelect
                    .map((name) => {
                      let option = {};
                      option.displayText = name;
                      option.value = name;
                      return option;
                    });

            // Create an empty option, which shows all productions
            let emptyOption = {};
            emptyOption.displayText = "All";
            emptyOption.value = null;

            prodArray.unshift(emptyOption);

            this.productions = prodArray;
          }
        }
      },

      methods: {
        dateFormat
      }
    });
</script>
