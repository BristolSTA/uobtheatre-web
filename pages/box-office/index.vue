<template>
  <div class="container flex flex-col items-center justify-center px-1 h-full">
    <loading-container
      :loading="loading"
      :hide-content-when-loading="!performances.length"
    >
      <div v-if="performances.length">
        <h1 class="text-center text-h1">Select a performance</h1>
        <select
          v-if="performances.length > 4"
          class="p-2 w-full text-gray-700"
          @change="
            selectPerformance(($event?.target as HTMLSelectElement)?.value)
          "
        >
          <option selected disabled>Select one...</option>
          <option
            v-for="(performance, index) in performances"
            :key="index"
            :value="performance.id"
          >
            {{ performance.production.name }} -
            {{ dateFormat(performance.start, 'cccc dd MMMM T') }}
          </option>
        </select>
        <div v-else class="grid gap-2 grid-cols-2 mt-2 md:grid-cols-4">
          <div
            v-for="(performance, index) in performances"
            :key="index"
            class="p-3 max-w-md text-center hover:bg-sta-gray-dark bg-sta-gray-light rounded cursor-pointer"
            @click="selectPerformance(performance.id)"
          >
            <production-featured-image
              :image-object="performance.production.featuredImage"
              class="w-full"
            />
            <h3 class="text-sta-orange text-xl font-semibold">
              {{ performance.production.name }}
            </h3>
            <h4 v-if="performance.venue" class="text-sta-green">
              {{ performance.venue.name }}
            </h4>
            <span
              >{{ dateFormat(performance.start, 'cccc dd MMMM T') }} (Doors
              {{ dateFormat(performance.doorsOpen, 'T') }})</span
            >
          </div>
        </div>
      </div>
      <div v-else class="px-4 py-6">
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
    <div class="flex gap-4">
      <div class="flex flex-col justify-center mt-2 gap-y-2">
        <VueDatepicker
          v-model="selectedDate"
          format="dd/MM/yyyy"
          placeholder="Today"
          :required="true"
          :enable-time-picker="false"
          :start-time="{ hours: 0, minutes: 0, seconds: 0 }"
        />
      </div>
      <div class="mt-4 text-lg">
        <button
          class="hover:bg-white hover:text-sta-gray transition px-2 rounded-lg"
          @click="refresh"
        >
          <font-awesome-icon
            icon="arrows-rotate"
            :class="{ 'animate-spin': loading }"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DateTime } from 'luxon';
import { dateFormat } from '@/utils/datetime';
import LoadingContainer from '@/components/ui/LoadingContainer.vue';
import ProductionFeaturedImage from '@/components/production/ProductionFeaturedImage.vue';
import VueDatepicker from '@vuepic/vue-datepicker';
import { useBoxOfficePerformancesQuery } from '~~/graphql/codegen/operations';
import { IdInput } from '~~/types/generic';
definePageMeta({
  middleware: ['authed', 'can-boxoffice']
});

useHead({
  title: 'Select Box Office Performance'
});

const selectedDate = ref<Date | undefined>();
const today = ref<DateTime | undefined>();
updateDateOptions();
const optionsTimer = setInterval(updateDateOptions, 10 * 1000);

const dateToSearch = computed(() => {
  return selectedDate.value
    ? DateTime.fromJSDate(selectedDate.value).toISODate()
    : today.value?.toISODate() ?? DateTime.now().toISODate();
});

onUnmounted(() => {
  clearInterval(optionsTimer);
});

const {
  result: queryResult,
  refetch: refetchPerformances,
  loading
} = useBoxOfficePerformancesQuery(
  () => ({
    date: dateToSearch.value
  }),
  {
    fetchPolicy: 'network-only'
  }
);

const performances = computed(
  () =>
    queryResult.value?.performances?.edges
      .filter((edge) => edge?.node?.production.status == 'PUBLISHED')
      .map((edge) => edge?.node)
      .filter(isNonNullable) ?? []
);

function selectPerformance(performanceId: IdInput) {
  useRouter().push(`/box-office/${performanceId}`);
}

function updateDateOptions() {
  today.value = DateTime.now().startOf('day');
}

function refresh() {
  updateDateOptions();
  refetchPerformances();
}
</script>
