<script>
import { AdminProductionCountDocument } from '~/graphql/codegen/operations';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'vue-chartjs';
import useAuthStore from '~/store/auth';

ChartJS.register(ArcElement, Tooltip, Legend);

function makeProductionQuery(status) {
  return {
    query: AdminProductionCountDocument,
    variables: { status },
    update(data) {
      return data.productions.edges;
    }
  };
}

export default {
  components: {
    Doughnut
  },
  data() {
    return {
      authStore: useAuthStore()
    };
  },

  apollo: {
    draftProductions: makeProductionQuery('DRAFT'),
    pendingProductions: makeProductionQuery('PENDING'),
    approvedProductions: makeProductionQuery('APPROVED'),
    liveProductions: makeProductionQuery('PUBLISHED')
  },

  computed: {
    productionCountByStatus() {
      // return [0,0,0,0];
      return [
        this.draftProductions?.length || 0,
        this.pendingProductions?.length || 0,
        this.approvedProductions?.length || 0,
        this.liveProductions?.length || 0
      ];
    },

    chartData() {
      return {
        labels: ['Draft', 'Pending', 'Approved', 'Published'],
        datasets: [
          {
            backgroundColor: ['#2b303a', '#ff6978', '#fdae39', '#4b8f8c'],
            borderWidth: 1,
            data: this.productionCountByStatus
          }
        ]
      };
    },
    chartOptions() {
      return {
        responsive: true,
        plugins: {
          tooltip: {
            enabled: true
          },
          legend: {
            display: false
          }
        },
        hover: {
          mode: null
        }
      };
    }
  }
};
</script>

<template>
  <UiCard v-if="authStore.hasPermission('approve_production')">
    <h2 class="font-bold text-xl text-center">Active Productions</h2>
    <div class="flex flex-row justify-center items-center gap-8">
      <div class="inline-block">
        <Doughnut
          :data="chartData"
          :options="chartOptions"
          width="150"
          height="150"
        />
      </div>
      <ul class="chart-counts">
        <li>Published: {{ productionCountByStatus[3] }}</li>
        <li>Approved: {{ productionCountByStatus[2] }}</li>
        <li>Pending: {{ productionCountByStatus[1] }}</li>
        <li>Draft: {{ productionCountByStatus[0] }}</li>
      </ul>
    </div>
  </UiCard>
</template>

<style scoped>
li:before {
  content: '';
  display: inline-flex;
  width: 0.8rem;
  height: 0.8rem;
  border: 1px solid white;
  border-radius: 15%;
  margin: auto 0.5rem auto 0;
}
li:nth-child(1):before {
  background-color: var(--color-sta-green);
}
li:nth-child(2):before {
  background-color: var(--color-sta-gold);
}
li:nth-child(3):before {
  background-color: var(--color-sta-rouge);
}
li:nth-child(4):before {
  background-color: var(--color-sta-gray);
}
</style>
