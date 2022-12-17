<template>
  <div class="container flex flex-col items-center justify-center px-1 h-full">
    <loading-container
      :loading="$apollo.queries.performances.loading"
      :hide-content-when-loading="true"
    >
      <div v-if="performances.length">
        <h1 class="text-center text-h1">Select a performance</h1>
        <select
          v-if="performances.length > 4"
          v-model="selectedPerformance"
          class="p-2 w-full text-gray-700"
        >
          <option selected disabled>Select one...</option>
          <option v-for="(performance, index) in performances" :key="index">
            {{ performance.production.name }} -
            {{ dateFormat(performance.start, 'cccc dd MMMM T') }}
          </option>
        </select>
        <div class="grid gap-2 grid-cols-2 mt-2 md:grid-cols-4">
          <div
            v-for="(performance, index) in performances"
            :key="index"
            class="p-3 max-w-md text-center hover:bg-sta-gray-dark bg-sta-gray-light rounded cursor-pointer"
            @click="selectedPerformance = performance"
          >
            <production-featured-image
              :image-object="performance.production.featuredImage"
              class="w-full"
            />
            <h3 class="text-sta-orange text-xl font-semibold">
              {{ performance.production.name }}
            </h3>
            <h4 class="text-sta-green">
              {{ performance.venue.name }}
            </h4>
            <span
              >{{ dateFormat(performance.start, 'cccc dd MMMM T') }} (Doors
              {{ dateFormat(performance.doorsOpen, 'T') }})</span
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
      <UiInputSelect v-model="selectedDate" :options="dateOptions" />
      <VueDatepicker
        v-if="!selectedDate"
        v-model="datePickerDate"
        format="dd/MM/yyyy"
        :required="true"
        :enable-time-picker="false"
        :start-time="{ hours: 0, minutes: 0, seconds: 0 }"
      />
    </div>
  </div>
</template>

<script>
import { DateTime } from 'luxon';
import { dateFormat } from '@/utils/datetime';
import BoxOfficePerformancesAvailable from '@/graphql/queries/box-office/BoxOfficePerformancesAvailable.gql';
import LoadingContainer from '@/components/ui/LoadingContainer.vue';
import ProductionFeaturedImage from '@/components/production/ProductionFeaturedImage.vue';
import VueDatepicker from '@vuepic/vue-datepicker';
definePageMeta({
  middleware: ['authed', 'can-boxoffice']
});

export default defineNuxtComponent({
  components: { LoadingContainer, ProductionFeaturedImage, VueDatepicker },
  data() {
    return {
      selectedPerformance: null,
      performances: [],
      selectedDate: null,
      datePickerDate: null,
      dateOptions: [],
      optionsTimer: null
    };
  },
  head: {
    title: 'Box Office Select'
  },
  computed: {
    dateToSearch() {
      return this.selectedDate !== null
        ? this.selectedDate
        : DateTime.fromJSDate(this.datePickerDate).toISODate();
    }
  },
  watch: {
    selectedPerformance(performance) {
      useRouter().push(`/box-office/${performance.id}`);
    }
  },
  mounted() {
    this.updateDateOptions();
    this.optionsTimer = setInterval(this.updateDateOptions, 60 * 60 * 1000);
  },
  unmounted() {
    clearInterval(this.optionsTimer);
  },
  apollo: {
    performances: {
      query: BoxOfficePerformancesAvailable,
      variables() {
        return {
          date: this.dateToSearch
        };
      },
      skip() {
        return !this.dateToSearch || this.dateToSeach === '';
      },
      fetchPolicy: 'cache-and-network',

      update: (data) =>
        data.performances.edges
          .map((edge) => edge.node)
          .filter(
            (performance) => performance.production.status === 'PUBLISHED'
          )
    }
  },
  methods: {
    dateFormat,
    updateDateOptions() {
      this.selectedDate = DateTime.now().toISODate();
      this.datePickerDate = DateTime.now().toISODate();
      this.dateOptions = [
        { value: DateTime.now().toISODate(), displayText: 'Today' },
        {
          value: DateTime.now().plus({ days: 1 }).toISODate(),
          displayText: 'Tomorrow'
        },
        { value: null, displayText: 'Custom' }
      ];
    }
  }
});
</script>
