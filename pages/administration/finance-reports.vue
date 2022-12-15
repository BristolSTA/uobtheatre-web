<template>
  <AdminPage title="Finance Reports">
    <all-errors-display :errors="errors" />
    <loading-container :loading="generating">
      <div class="space-y-4">
        <h2 class="text-h2">Select Report</h2>
        <UiInputSelect
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
              <VueDatepicker
                v-model="start"
                format="dd/MM/yyyy HH:mm"
                :required="true"
                :start-time="{ hours: 0, minutes: 0, seconds: 0 }"
              />
            </template>
          </form-label>
          <form-label field-name="endTime">
            End Time
            <template #control>
              <VueDatepicker
                v-model="end"
                format="dd/MM/yyyy HH:mm"
                :required="true"
                :start-time="{ hours: 0, minutes: 0, seconds: 0 }"
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
  </AdminPage>
</template>

<script>
import AllErrorsDisplay from '@/components/ui/AllErrorsDisplay.vue';
import FormLabel from '@/components/ui/FormLabel.vue';
import { getValidationErrors, performMutation } from '~~/utils/api';
import LoadingContainer from '@/components/ui/LoadingContainer.vue';
import { GenerateReportDocument } from '~~/graphql/codegen/operations';
import VueDatepicker from '@vuepic/vue-datepicker';

export default defineNuxtComponent({
  components: { AllErrorsDisplay, FormLabel, LoadingContainer, VueDatepicker },
  data() {
    return {
      errors: null,
      currentReport: null,
      start: null,
      end: null,
      generating: false,

      reports: [
        {
          displayText: 'Period Totals',
          value: 'PeriodTotals',
          requires_times: true
        },
        { displayText: 'Outstanding Payments', value: 'OutstandingPayments' }
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
