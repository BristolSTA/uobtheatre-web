<template>
  <div class="container flex flex-col items-center justify-center h-full">
    <div v-if="performances.length">
      <h1 class="text-h1">Select a performance</h1>
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
      <div v-else class="flex mt-2 space-x-2">
        <div
          v-for="(performance, index) in performances"
          :key="index"
          class="w-1/2 max-w-md p-3 text-center rounded cursor-pointer bg-sta-gray-light hover:bg-sta-gray-dark"
          @click="selectedPerformance = performance"
        >
          <img :src="performance.production.featuredImage.url" class="w-full" />
          <h3 class="text-xl font-semibold text-sta-orange">
            {{ performance.production.name }}
          </h3>
          <span
            >{{ performance.start | dateFormat('cccc dd MMMM T') }} (Doors
            {{ performance.doorsOpen | dateFormat('T') }})</span
          >
        </div>
      </div>
      <div class="flex justify-center mt-2">
        <div class="p-2 text-gray-400 rounded bg-sta-gray-dark">
          <font-awesome-icon icon="calendar" />
          <select class="w-auto outline-none cursor-pointer bg-sta-gray-dark">
            <option selected>Today</option>
            <option>Tomorrow</option>
            <option>Other</option>
          </select>
        </div>
      </div>
    </div>
    <div v-else>
      <h1 class="text-h1">No performances available</h1>
      <p>
        There are no performances available for you to open a box office for.
      </p>
      <p>
        If you believe this is a mistake, please contact your Society or a
        member of the STA
      </p>
    </div>
  </div>
</template>

<script>
// TODO: Actually finish
export default {
  asyncData({ params, error, app }) {
    // TODO: Implement query
    return {
      performances: [
        {
          id: 1,
          venue: {
            name: 'Winston Theatre',
          },
          start: '2020-12-19T15:00:00',
          doorsOpen: '2020-12-19T14:30:00',
          production: {
            name: 'Legally Blonde',
            featuredImage: {
              url: 'https://via.placeholder.com/1920x960',
              __typename: 'ImageNode',
            },
            __typename: 'ProductionNode',
          },
          __typename: 'PerformanceNode',
        },
        {
          id: 2,
          venue: {
            name: 'Pegg Theatre',
          },
          start: '2020-12-19T19:00:00',
          doorsOpen: '2020-12-19T18:00:00',
          production: {
            name: 'TRASh',
            featuredImage: {
              url: 'https://via.placeholder.com/1920x960',
              __typename: 'ImageNode',
            },
            __typename: 'ProductionNode',
          },
          __typename: 'PerformanceNode',
        },
      ],
    }
  },
  data() {
    return {
      selectedPerformance: null,
      performances: [],
    }
  },
  head: {
    title: 'Box Office Select',
  },
  watch: {
    selectedPerformance(performance) {
      this.$router.push(`/box-office/${performance.id}`)
    },
  },
}
</script>
