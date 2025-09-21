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
      <UiTablesPaginatedTable
        :offset="0"
        :items="booking.tickets"
        :page-info="{}"
      >
        <template #head>
          <UiTablesTableHeadItem>Ticket ID</UiTablesTableHeadItem>
          <UiTablesTableHeadItem>Seat Group</UiTablesTableHeadItem>
          <UiTablesTableHeadItem>Concession Type</UiTablesTableHeadItem>
          <UiTablesTableHeadItem>Checked In</UiTablesTableHeadItem>
          <UiTablesTableHeadItem v-if="anyTicketsChecked"
            >Checked In By</UiTablesTableHeadItem
          >
          <UiTablesTableHeadItem v-if="anyTicketsChecked"
            >Checked In At</UiTablesTableHeadItem
          >
        </template>
        <UiTablesTableRow v-for="ticket in booking.tickets" :key="ticket.id">
          <UiTablesTableRowItem>{{ ticket.id }}</UiTablesTableRowItem>
          <UiTablesTableRowItem>{{
            ticket.seatGroup.name
          }}</UiTablesTableRowItem>
          <UiTablesTableRowItem>{{
            ticket.concessionType.name
          }}</UiTablesTableRowItem>
          <UiTablesTableRowItem>{{
            ticket.checkedIn ? 'Yes' : 'No'
          }}</UiTablesTableRowItem>
          <UiTablesTableRowItem v-if="anyTicketsChecked">{{
            ticket.checkedIn
              ? `${ticket.checkedInBy.firstName} ${ticket.checkedInBy.lastName}`
              : 'N/A'
          }}</UiTablesTableRowItem>
          <UiTablesTableRowItem v-if="anyTicketsChecked">{{
            ticket.checkedIn ? ticket.checkedInAt.toHTTP() : 'N/A'
          }}</UiTablesTableRowItem>
        </UiTablesTableRow>
      </UiTablesPaginatedTable>
    </UiCard>
    <div class="grid gap-4 grid-cols-1 lg:grid-cols-6">
      <booking-performance-overview
        class="lg:col-span-4"
        :production="production"
        :performance="booking.performance"
      />
      <venue-overview
        class="lg:col-span-2"
        :venue-data="booking.performance.venue.slug"
        :online="booking.performance.isOnline"
        :in-person="booking.performance.isInperson"
      />
      <accessibility-overview
        class="lg:col-span-3"
        :booking="booking"
        :show-previous="true"
      />
      <VenueAccessibility
        :venue-data="booking.performance.venue.slug"
        class="lg:col-span-3"
      />
      <payment-overview class="lg:col-span-2" :booking="booking" />
      <tickets-overview class="lg:col-span-4" :booking="booking" />
    </div>
  </AdminPage>
</template>

<script>
import ProductionBanner from '@/components/production/ProductionBanner.vue';
import BookingPerformanceOverview from '@/components/booking/overview/PerformanceOverview.vue';
import VenueOverview from '@/components/booking/overview/VenueOverview.vue';
import PaymentOverview from '@/components/booking/overview/PaymentOverview.vue';
import TicketsOverview from '@/components/booking/overview/TicketsOverview.vue';
import AccessibilityOverview from '@/components/booking/overview/AccessibilityOverview.vue';
import Booking from '~~/classes/Booking';

import TableRow from '@/components/ui/Tables/TableRow.vue';
import TableHeadItem from '@/components/ui/Tables/TableHeadItem.vue';
import TableRowItem from '@/components/ui/Tables/TableRowItem.vue';
import BookingStatusEnum from '~~/enums/PayableStatusEnum';

import { dateFormat } from '@/utils/datetime';
import { AdminBookingDetailDocument } from '~~/graphql/codegen/operations';

export default defineNuxtComponent({
  components: {
    ProductionBanner,
    BookingPerformanceOverview,
    VenueOverview,
    PaymentOverview,
    TicketsOverview,
    AccessibilityOverview,
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
    },
    anyTicketsChecked() {
      return this.booking.tickets.some((ticket) => ticket.checkedIn);
    }
  }
});
</script>
