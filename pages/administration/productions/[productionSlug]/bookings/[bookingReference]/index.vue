<template>
  <AdminPage title="View Booking">
    <h2 class="text-sta-orange text-h2">Reference - {{ booking.reference }}</h2>
    <production-banner
      class="pb-2 md:pb-8"
      :production="production"
      :show-buy-tickets-button="false"
      :show-detailed-info="false"
    />
    <UiCard title="Admin Information" class="mb-4">
      <table>
        <table-row v-for="(row, index) in adminInfo" :key="index">
          <table-head-item>{{ row[0] }}</table-head-item>
          <table-row-item>{{ row[1] }}</table-row-item>
        </table-row>
      </table>
    </UiCard>
    <UiCard title="Ticket Inspection" class="mb-4">
      <table>
        <table-row>
          <table-head-item>Ticket ID</table-head-item>
          <table-row-item>Seat Group</table-row-item>
          <table-row-item>Concession Type</table-row-item>
          <table-row-item>Checked In</table-row-item>
          <table-row-item v-if="anyTicketsChecked(booking)"
            >Checked In By</table-row-item
          >
          <table-row-item v-if="anyTicketsChecked(booking)"
            >Checked In At</table-row-item
          >
        </table-row>
        <table-row v-for="ticket in booking.tickets" :key="ticket">
          <table-head-item>{{ ticket.id }}</table-head-item>
          <table-row-item>{{ ticket.seatGroup.name }}</table-row-item>
          <table-row-item>{{ ticket.concessionType.name }}</table-row-item>
          <table-row-item>{{ checkedInShow(ticket) }}</table-row-item>
          <table-row-item v-if="anyTicketsChecked(booking)">{{
            checkedInByDisplay(ticket)
          }}</table-row-item>
          <table-row-item v-if="anyTicketsChecked(booking)">{{
            checkedInAtDisplay(ticket)
          }}</table-row-item>
        </table-row>
      </table>
    </UiCard>
    <div class="grid gap-4 grid-cols-1 lg:grid-cols-3">
      <booking-performance-overview
        class="lg:col-span-2"
        :production="production"
        :performance="booking.performance"
      />
      <venue-overview
        class="lg:col-span-1"
        :venue-data="booking.performance.venue.slug"
        :online="booking.performance.isOnline"
        :in-person="booking.performance.isInperson"
      />

      <payment-overview class="lg:col-span-1" :booking="booking" />
      <tickets-overview class="lg:col-span-2" :booking="booking" />
    </div>
  </AdminPage>
</template>

<script>
import ProductionBanner from '@/components/production/ProductionBanner.vue';
import BookingPerformanceOverview from '@/components/booking/overview/PerformanceOverview.vue';
import VenueOverview from '@/components/booking/overview/VenueOverview.vue';
import PaymentOverview from '@/components/booking/overview/PaymentOverview.vue';
import TicketsOverview from '@/components/booking/overview/TicketsOverview.vue';
import Booking from '~~/classes/Booking';

import TableRow from '@/components/ui/Tables/TableRow.vue';
import TableHeadItem from '@/components/ui/Tables/TableHeadItem.vue';
import TableRowItem from '@/components/ui/Tables/TableRowItem.vue';
import BookingStatusEnum from '~~/enums/PayableStatusEnum';

import { dateFormat } from '@/utils/datetime';
import { AdminBookingDetailDocument } from '~~/graphql/codegen/operations';
import { DateTime } from 'luxon';

const now = useClock(5);

export default defineNuxtComponent({
  components: {
    ProductionBanner,
    BookingPerformanceOverview,
    VenueOverview,
    PaymentOverview,
    TicketsOverview,
    TableHeadItem,
    TableRowItem,
    TableRow
  },
  async asyncData() {
    const { data } = await useDefaultApolloClient().query({
      query: AdminBookingDetailDocument,
      variables: {
        bookingReference: useRoute().params.bookingReference
      }
    });

    if (!data.bookings.edges[0]) {
      throw createSafeError({
        statusCode: 404,
        message: 'This booking does not exist'
      });
    }

    const rawBooking = data.bookings.edges[0].node;

    return {
      booking: Booking.fromAPIData(rawBooking),
      rawBooking
    };
  },
  computed: {
    production() {
      return this.booking.performance.production;
    },
    adminInfo() {
      return [
        ['Status', new BookingStatusEnum(this.rawBooking.status).name],
        [
          'Created At',
          dateFormat(this.rawBooking.createdAt, 'dd/MMM/y HH:mm ZZZZ')
        ],
        [
          'Updated At',
          dateFormat(this.rawBooking.updatedAt, 'dd/MMM/y HH:mm ZZZZ')
        ],
        [
          'Created By',
          `${this.rawBooking.creator.firstName} ${this.rawBooking.creator.lastName} (Email: ${this.rawBooking.creator.email})`
        ],
        [
          'Owned By',
          `${this.rawBooking.user.firstName} ${this.rawBooking.user.lastName} (Email: ${this.rawBooking.user.email})`
        ],
        ['Admin Discount', this.rawBooking.adminDiscountPercentage * 100 + '%']
      ];
    }
  },
  methods: {
    anyTicketsChecked(booking) {
      for (const ticket of booking.tickets) {
        if (ticket.checkedIn) {
          return true;
        }
      }
      return false;
    },
    checkedInShow(ticket) {
      if (ticket.checkedIn) {
        return 'Yes';
      } else {
        return 'No';
      }
    },
    checkedInByDisplay(ticket) {
      if (ticket.checkedIn) {
        return ticket.checkedInBy.firstName + ' ' + ticket.checkedInBy.lastName;
      } else {
        return 'N/A';
      }
    },
    checkedInAtDisplay(ticket) {
      if (ticket.checkedIn) {
        return DateTime.fromISO(ticket.checkedInAt).toHTTP();
      } else {
        return 'N/A';
      }
    }
  }
});
</script>
