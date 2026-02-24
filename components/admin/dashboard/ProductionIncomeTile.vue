<script>
import { AdminPaymentBreakdownByPublishedProductionDocument } from '~/graphql/codegen/operations';
import ProgressBar from '~/components/ui/ProgressBar.vue';
import useAuthStore from '~/store/auth';

export default {
  components: { ProgressBar },
  data() {
    return {
      authStore: useAuthStore()
    };
  },
  apollo: {
    productionIncomes: {
      query: AdminPaymentBreakdownByPublishedProductionDocument,
      update(data) {
        console.log(data);
        return data.productions;
      }
    }
  },
  computed: {
    publishedProductions() {
      return (
        this.productionIncomes?.edges?.map(({ node }) => {
          return {
            ...node,
            ticketPercentage: Math.round(
              (node.totalTicketsSold / node.totalCapacity) * 100
            )
          };
        }) || []
      );
    }
  }
};
</script>

<template>
  <UiCard v-if="authStore.hasPermission('finance_reports')">
    <h2 class="font-bold text-xl text-center">Sales Breakdown by Production</h2>
    <table class="w-full table-auto overflow-x-scroll">
      <tr class="font-bold border-b">
        <td class="">Production</td>
        <td class="text-center">Availability</td>
        <td class="text-right">Society Revenue</td>
        <td class="text-right">App Fees</td>
      </tr>
      <tr v-for="production in publishedProductions" :key="production.id">
        <td class="">
          <a
            href="/administration/productions/{{$production.slug}}"
            class="hover:underline cursor-pointer hover:text-sta-gold block"
          >
            {{ production.name }}
          </a>
        </td>
        <td class="grid md:grid-cols-2 gap-2 items-center h-full">
          <progress-bar :height="2" :percentage="production.ticketPercentage" />
          <p class="text-nowrap hidden md:inline-block">
            {{ production.totalTicketsSold }} of
            {{ production.totalCapacity }}
          </p>
        </td>
        <td class="text-right tabular-nums">
          £{{ (production.salesBreakdown.societyRevenue / 100).toFixed(2) }}
        </td>
        <td class="text-right tabular-nums">
          £{{ (production.salesBreakdown.appPaymentValue / 100).toFixed(2) }}
        </td>
      </tr>
    </table>
  </UiCard>
</template>

<style scoped>
table tr td {
  margin: 0.25rem 0.5rem;
}
</style>
