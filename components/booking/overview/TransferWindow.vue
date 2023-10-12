<template>
  <overview-box>
    <UiTablesPaginatedTable
      :offset="0"
      :items="performances"
      :page-info="{}"
      class="mb-2"
    >
      <template #head>
        <UiTablesTableHeadItem>Select Performance</UiTablesTableHeadItem>
        <UiTablesTableHeadItem>Performance ID</UiTablesTableHeadItem>
        <UiTablesTableHeadItem>Date</UiTablesTableHeadItem>
        <UiTablesTableHeadItem>Start Time</UiTablesTableHeadItem>
        <UiTablesTableHeadItem>Venue</UiTablesTableHeadItem>
        <UiTablesTableHeadItem>Capacity Remaining</UiTablesTableHeadItem>
      </template>
      <UiTablesTableRow
        v-for="performance in performances"
        :key="performance.id"
      >
        <UiTablesTableRowItem
          v-if="
            performance.start !== oldBooking.performance.start &&
            !performance.soldOut
          "
          class="text-center"
        >
          <input
            :id="performance.id"
            v-model="transferTargetPerformance"
            type="radio"
            :name="performance.id"
            :value="performance"
        /></UiTablesTableRowItem>
        <UiTablesTableRowItem
          v-else-if="performance.start == oldBooking.performance.start"
          class="text-center"
        >
          Same Performance
        </UiTablesTableRowItem>
        <UiTablesTableRowItem v-else class="text-center">
          Performance Sold Out
        </UiTablesTableRowItem>
        <UiTablesTableRowItem>{{ performance.id }}</UiTablesTableRowItem>
        <UiTablesTableRowItem>{{
          dateFormat(performance.start, 'cccc d MMM')
        }}</UiTablesTableRowItem>
        <UiTablesTableRowItem>{{
          dateFormat(performance.start, 'T')
        }}</UiTablesTableRowItem>
        <UiTablesTableRowItem>{{
          performance.venue.name
        }}</UiTablesTableRowItem>
        <UiTablesTableRowItem v-if="!performance.soldOut">{{
          performance.capacityRemaining
        }}</UiTablesTableRowItem>
        <UiTablesTableRowItem v-else> Sold Out! </UiTablesTableRowItem>
      </UiTablesTableRow>
    </UiTablesPaginatedTable>
    <UiStaButton v-if="!transferTargetPerformance" colour="grey"
      >Initiate Transfer</UiStaButton
    >
    <UiStaButton
      v-else
      colour="orange"
      @click="doTransfers(transferTargetPerformance)"
      >Initiate Transfer</UiStaButton
    >
  </overview-box>
</template>

<script>
import OverviewBox from '../../ui/UiCard.vue';
import Booking from '~~/classes/Booking';
import { swal } from '~~/utils/alerts';

export default {
  name: 'TransferWindow',
  components: { OverviewBox },
  props: {
    oldBooking: {
      required: true,
      type: Booking
    },
    production: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      transferTargetPerformance: null
    };
  },
  computed: {
    performances() {
      return this.production.performances.edges.map((edge) => edge.node);
    }
  },
  methods: {
    doTransfers(targetProduction) {
      const old_booking = this.booking;

      swal.fire({
        title: "I'm a Popup!",
        text: 'Transfering ticket to ' + targetProduction.id,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showCancelButton: true,
        showConfirmButton: true
      });
    }
  }
};
</script>
