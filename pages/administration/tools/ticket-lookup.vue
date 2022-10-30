<template>
  <admin-page title="Ticket Lookup">
    <div v-if="!scannedData">
      <ticket-scanner @scanned="onScan" />
    </div>
    <div v-else class="space-y-2">
      <h2 class="text-h2">Scanned Details</h2>
      Booking Reference: {{ scannedData.bookingReference }} | Ticket ID:
      {{ scannedData.ticketId }}
      <div
        class="flex flex-wrap space-x-4 space-y-2 lg:flex-nowrap lg:space-y-0"
      >
        <card v-if="ticketDetails" title="Ticket">
          <table>
            <table-row>
              <table-head-item>Seat Group</table-head-item>
              <table-row-item>
                {{ ticketDetails.seatGroup.name }}
              </table-row-item>
            </table-row>
            <table-row>
              <table-head-item>Concession Type</table-head-item>
              <table-row-item>
                {{ ticketDetails.concessionType.name }}
              </table-row-item>
            </table-row>
            <table-row>
              <table-head-item>Checked In</table-head-item>
              <table-row-item>{{ ticketDetails.checkedIn }}</table-row-item>
            </table-row>
          </table>
        </card>
        <card v-if="bookingInfo" title="Booking">
          <table>
            <table-row>
              <table-head-item>Performance</table-head-item>
              <table-row-item>
                {{ bookingInfo.performance.production.name }} at
                {{
                  bookingInfo.performance.start | dateFormat('EEEE d MMMM kkkk')
                }}
              </table-row-item>
            </table-row>
            <table-row>
              <table-head-item>User</table-head-item>
              <table-row-item>
                {{ bookingInfo.user.firstName }}
                {{ bookingInfo.user.lastName }}
              </table-row-item>
            </table-row>
            <table-row v-if="bookingInfo.creator">
              <table-head-item>Creator</table-head-item>
              <table-row-item>
                {{ bookingInfo.creator.firstName }}
                {{ bookingInfo.creator.lastName }}
              </table-row-item>
            </table-row>
            <table-row>
              <table-head-item>View Booking</table-head-item>
              <table-row-item>
                <nuxt-link
                  class="inline-block m-2 ml-0 p-2 bg-sta-green hover:bg-sta-green-dark transition-colors"
                  :to="`/administration/productions/${bookingInfo.performance.production.slug}/bookings/${bookingInfo.reference}`"
                >
                  View Booking
                </nuxt-link>
              </table-row-item>
            </table-row>
          </table>
        </card>
      </div>
    </div>
  </admin-page>
</template>

<script>
import TicketScanner from '@/components/ui/Inputs/TicketScanner.vue';
import AdminPage from '@/components/admin/AdminPage.vue';
import Card from '@/components/ui/Card.vue';
import { errorToast } from '~~/utils/alerts';
import TableRow from '@/components/ui/Tables/TableRow.vue';
import TableHeadItem from '@/components/ui/Tables/TableHeadItem.vue';
import TableRowItem from '@/components/ui/Tables/TableRowItem.vue';
import { AdminBookingLookupDocument } from '@/graphql/codegen/operations';
export default {
  components: {
    TicketScanner,
    AdminPage,
    Card,
    TableHeadItem,
    TableRowItem,
    TableRow
  },
  data() {
    return {
      ticket: null,
      scannedData: null,
      bookingInfo: null
    };
  },
  computed: {
    ticketDetails() {
      if (!this.bookingInfo) {
        return;
      }
      return this.bookingInfo.tickets.find(
        (ticket) => ticket.id === this.scannedData.ticketId
      );
    }
  },
  methods: {
    async onScan(e) {
      this.scannedData = e;
      this.bookingInfo = null;
      const { data } = await this.$apollo.query({
        query: AdminBookingLookupDocument,
        variables: {
          reference: this.scannedData.bookingReference
        }
      });
      if (!data.bookings.edges.length) {
        return errorToast.fire({
          title: 'A matching booking does not exisit for this reference'
        });
      }
      this.bookingInfo = data.bookings.edges[0].node;
    }
  }
};
</script>
