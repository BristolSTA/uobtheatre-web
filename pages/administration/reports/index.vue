<template>
  <admin-page title="Finance Reports">
    <div v-for="(reportList, title) in reports" :key="title">
      <h3 class="text-h3">{{ title }} Reports</h3>
      <div
        class="
          flex
          gap-2
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
        "
      >
        <menu-tile
          v-for="(report, index) in reportList"
          :key="index"
          :to="`/administration/reports/${report.value}`"
          class="bg-sta-green"
          >{{ report.text }}</menu-tile
        >
      </div>
      <hr class="mt-2" />
    </div>
  </admin-page>
</template>

<script>
import AdminPage from '@/components/admin/AdminPage.vue'
import MenuTile from '@/components/ui/MenuTile.vue'

export const allReports = {
  Financial: [
    {
      text: 'Period Totals',
      value: 'PeriodTotals',
      requires_times: true,
    },
    { text: 'Outstanding Payments', value: 'OutstandingPayments' },
  ],
}

export default {
  components: {
    AdminPage,
    MenuTile,
  },
  data() {
    return {
      errors: null,
      currentReport: null,
      start: null,
      end: null,
      generating: false,

      reports: allReports,
    }
  },
  head: {
    title: 'Finance Reports',
  },
}
</script>
