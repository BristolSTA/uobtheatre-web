<template>
  <admin-page :title="reportConfig.text">
    <all-errors-display :errors="errors" />

    <div class="space-y-4">
      <template v-if="reportConfig.requires_times">
        <div class="flex w-full gap-2">
          <form-label name="startTime" class="w-full md:w-1/2">
            Start Time
            <template #control>
              <t-datepicker
                v-model="reportParams.startTime"
                :timepicker="true"
                user-format="Y-m-d H:i:S"
                date-format="Y-m-dTH:i:S"
                class="text-black"
                :required="true"
                :initial-time="'00:00:00'"
              />
            </template>
          </form-label>
          <form-label name="endTime" class="w-full md:w-1/2">
            End Time
            <template #control>
              <t-datepicker
                v-model="reportParams.endTime"
                :timepicker="true"
                class="text-black"
                user-format="Y-m-d H:i:S"
                date-format="Y-m-dTH:i:S"
                :required="true"
                :initial-time="'00:00:00'"
              />
            </template>
          </form-label>
        </div>
      </template>

      <template v-if="reportData">
        <div v-for="(dataset, index) in reportData.datasets" :key="index">
          <h4 class="text-h4">{{ dataset.name }}</h4>
          <safe-table>
            <thead>
              <table-row>
                <table-head-item
                  v-for="(heading, headingIndex) in dataset.headings"
                  :key="headingIndex"
                  >{{ heading }}</table-head-item
                >
              </table-row>
            </thead>
            <tbody>
              <template v-if="dataset.data.length">
                <table-row
                  v-for="(dataRow, dataRowIndex) in dataset.data"
                  :key="dataRowIndex"
                >
                  <table-row-item
                    v-for="(dataItem, dataRowItemIndex) in dataRow"
                    :key="dataRowItemIndex"
                    >{{ dataItem }}</table-row-item
                  >
                </table-row>
              </template>
              <table-row v-else>
                <table-row-item
                  :colspan="dataset.headings.length"
                  class="text-center font-bold"
                  >No Data</table-row-item
                >
              </table-row>
            </tbody>
          </safe-table>
        </div>
      </template>

      <template
        v-if="
          !reportConfig.requires_times ||
          (reportParams.startTime && reportParams.endTime)
        "
        ><button
          class="p-2 bg-sta-green hover:bg-sta-green-dark transition-colors"
          :disabled="loading"
          @click="fetchData"
        >
          Load Report
        </button>
        <button
          class="p-2 bg-sta-green hover:bg-sta-green-dark transition-colors"
          :disabled="downloading"
          @click="download"
        >
          Download Report
        </button>
      </template>
    </div>
  </admin-page>
</template>

<script>
import AdminPage from '@/components/admin/AdminPage.vue'
import { allReports } from '@/pages/administration/reports/index.vue'
import FormLabel from '@/components/ui/FormLabel.vue'
import { getValidationErrors, performMutation } from '@/utils'
import AllErrorsDisplay from '@/components/ui/AllErrorsDisplay.vue'
import SafeTable from '@/components/ui/Tables/SafeTable.vue'
import TableHeadItem from '@/components/ui/Tables/TableHeadItem.vue'
import TableRow from '@/components/ui/Tables/TableRow.vue'
import TableRowItem from '@/components/ui/Tables/TableRowItem.vue'

const getReportConfig = (route) => {
  for (const reportList of Object.values(allReports)) {
    const config = reportList.find(
      (report) => report.value === route.params.report
    )
    if (config) return config
  }
}

export default {
  components: {
    AdminPage,
    FormLabel,
    AllErrorsDisplay,
    SafeTable,
    TableHeadItem,
    TableRow,
    TableRowItem,
  },
  middleware({ route, error }) {
    if (!getReportConfig(route))
      return error({
        statusCode: 404,
        message: 'This report does not exist',
      })
  },
  data() {
    return {
      reportConfig: getReportConfig(this.$route),
      errors: null,
      loading: false,
      downloading: false,
      reportParams: {
        startTime: null,
        endTime: null,
      },
      reportData: null,
    }
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        const data = await performMutation(
          this.$apollo,
          {
            mutation: require('@/graphql/mutations/admin/reports/ReportDetailsQuery.gql'),
            variables: {
              name: this.reportConfig.value,
              startTime: this.reportParams.startTime,
              endTime: this.reportParams.endTime,
            },
          },
          'generateReport'
        )
        this.reportData = data.generateReport.report
      } catch (e) {
        this.errors = getValidationErrors(e)
      }
      this.loading = false
    },
    async download() {
      this.downloading = true
      try {
        const data = await performMutation(
          this.$apollo,
          {
            mutation: require('@/graphql/mutations/admin/reports/GenerateReport.gql'),
            variables: {
              name: this.reportConfig.value,
              start: this.reportParams.startTime,
              end: this.reportParams.endTime,
            },
          },
          'generateReport'
        )
        window.open(data.generateReport.downloadUri)
      } catch (e) {
        this.errors = getValidationErrors(e)
      } finally {
        this.downloading = false
      }
    },
  },
}
</script>
