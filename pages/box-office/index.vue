<template>
  <div class="container flex flex-col items-center justify-center h-full px-1">
    <loading-container
      :loading="$apollo.queries.performances.loading"
      :hide-content-when-loading="true"
    >
      <div v-if="performances.length">
        <h1 class="text-center text-h1">Select a performance</h1>
        <select
          v-if="performances.length > 4"
          v-model="selectedPerformance"
          class="w-full p-2 text-gray-700"
        >
          <option selected disabled>Select one...</option>
          <option v-for="(performance, index) in performances" :key="index">
            {{ performance.production.name }} -
            {{ performance.start | dateFormat('cccc dd MMMM T') }}
          </option>
        </select>
        <div class="grid grid-cols-2 gap-2 mt-2 md:grid-cols-4">
          <div
            v-for="(performance, index) in performances"
            :key="index"
            class="max-w-md p-3 text-center rounded cursor-pointer bg-sta-gray-light hover:bg-sta-gray-dark"
            @click="selectedPerformance = performance"
          >
            <img
              :src="performance.production.featuredImage.url"
              class="w-full"
            />
            <h3 class="text-xl font-semibold text-sta-orange">
              {{ performance.production.name }}
            </h3>
            <span
              >{{ performance.start | dateFormat('cccc dd MMMM T') }} (Doors
              {{ performance.doorsOpen | dateFormat('T') }})</span
            >
          </div>
        </div>
      </div>
      <div v-else>
        <h1 class="text-h1">No performances available</h1>
        <p>
          There are no performances available for you to open a box office for
          on the date selected.
        </p>
        <p>
          If you believe this is a mistake, please contact your Society or a
          member of the STA
        </p>
      </div>
    </loading-container>
    <div class="flex flex-col justify-center mt-2 space-y-2">
      <t-select v-model="selectedDate" :options="dateOptions" />
      <div>
        <t-datepicker
          v-if="!selectedDate"
          v-model="datePickerDate"
          :required="true"
          :clearable="false"
          class="text-black"
        />
      </div>
    </div>
  </div>
</template>

<script>
import BoxOfficePerformancesAvailable from '@/graphql/queries/box-office/BoxOfficePerformancesAvailable.gql'
import { DateTime } from 'luxon'
import LoadingContainer from '@/components/ui/LoadingContainer.vue'
export default {
  components: { LoadingContainer },
  middleware: 'authed',
  data() {
    return {
      selectedPerformance: null,
      performances: [],
      selectedDate: DateTime.now().toISODate(),
      datePickerDate: DateTime.now().toISODate(),
      dateOptions: [
        { value: DateTime.now().toISODate(), text: 'Today' },
        {
          value: DateTime.now().plus({ days: 1 }).toISODate(),
          text: 'Tomorrow',
        },
        { value: null, text: 'Custom' },
      ],
    }
  },
  head: {
    title: 'Box Office Select',
  },
  apollo: {
    performances: {
      query: BoxOfficePerformancesAvailable,
      variables() {
        return {
          date: this.dateToSearch,
        }
      },
      skip() {
        return !this.dateToSearch || this.dateToSeach === ''
      },
      update: (data) => data.performances.edges.map((edge) => edge.node),
    },
  },
  computed: {
    dateToSearch() {
      return this.selectedDate !== '' ? this.selectedDate : this.datePickerDate
    },
  },
  watch: {
    selectedPerformance(performance) {
      this.$router.push(`/box-office/${performance.id}`)
    },
  },
}
</script>
