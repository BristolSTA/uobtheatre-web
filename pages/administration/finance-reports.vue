<template>
  <admin-page title="Finance Reports">
    <all-errors-display :errors="errors" />
    <loading-container :loading="generating">
      <div class="space-y-4">
        <h2 class="text-h2">Select Report</h2>
        <t-select
          v-model="currentReport"
          placeholder="Select a report"
          :options="reports"
        />

        <template
          v-if="currentReportObject && currentReportObject.requires_times"
        >
          <h2 class="text-h2">Set report times</h2>
          <form-label field-name="startTime">
            Start Time
            <template #control>
              <t-datepicker
                v-model="start"
                :timepicker="true"
                user-format="Y-m-d H:i:S"
                date-format="Y-m-dTH:i:S"
                class="text-black"
                :required="true"
                :initial-time="'00:00:00'"
              />
            </template>
          </form-label>
          <form-label field-name="endTime">
            End Time
            <template #control>
              <t-datepicker
                v-model="end"
                :timepicker="true"
                class="text-black"
                user-format="Y-m-d H:i:S"
                date-format="Y-m-dTH:i:S"
                :required="true"
                :initial-time="'00:00:00'"
              />
            </template>
          </form-label>
        </template>

        <template
          v-if="
            currentReportObject &&
            (!currentReportObject.requires_times || (start && end))
          "
        >
          <button
            class="p-2 bg-sta-green hover:bg-sta-green-dark transition-colors"
            @click="generateReport"
          >
            Generate Report
          </button>
        </template>
      </div>
    </loading-container>
  </admin-page>
</template>

<script>
import AdminPage from '@/components/admin/AdminPage.vue';
import AllErrorsDisplay from '@/components/ui/AllErrorsDisplay.vue';
import FormLabel from '@/components/ui/FormLabel.vue';
import { getValidationErrors, performMutation } from '~~/utils/api';
import LoadingContainer from '@/components/ui/LoadingContainer.vue';
import { GenerateReportDocument } from '~~/graphql/codegen/operations';
export default defineNuxtComponent({
  components: { AdminPage, AllErrorsDisplay, FormLabel, LoadingContainer },
  data() {
    return {
      errors: null,
      currentReport: null,
      start: null,
      end: null,
      generating: false,

      reports: [
        { text: 'Period Totals', value: 'PeriodTotals', requires_times: true },
        { text: 'Outstanding Payments', value: 'OutstandingPayments' }
      ]
    };
  },
  head: {
    title: 'Finance Reports'
  },
  computed: {
    currentReportObject() {
      if (!this.currentReport) {
        return;
      }
      return this.reports.find((report) => report.value === this.currentReport);
    }
  },
  methods: {
    async generateReport() {
      this.generating = true;
      try {
        const data = await performMutation(
          this.$apollo,
          {
            mutation: GenerateReportDocument,
            variables: {
              name: this.currentReport,
              start: this.start,
              end: this.end
            }
          },
          'generateReport'
        );
        window.open(data.generateReport.downloadUri);
      } catch (e) {
        this.errors = getValidationErrors(e);
      } finally {
        this.generating = false;
      }
    }
  }
});
</script>
