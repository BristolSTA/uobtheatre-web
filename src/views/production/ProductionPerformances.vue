<template>
  <div class="container my-6 text-white">
    <div class="text-center"><h1 class="text-h2">Dates and Times</h1></div>
    <div
      class="my-20 text-xl text-center"
      v-if="!production.performances.length"
    >
      No Upcoming Performances
    </div>
    <div v-else class="flex flex-wrap justify-center">
      <div
        class="performance w-full md:w-1/2 lg:w-1/3 2xl:w-1/4"
        v-for="performance in production.performances"
        :key="performance.id"
      >
        <div
          class="p-3 pt-1 m-2"
          :class="[
            performanceDisabled(performance)
              ? 'bg-sta-gray-dark'
              : 'bg-sta-green',
          ]"
        >
          <h2 class="text-h2">
            {{ performance.start | dateFormat('cccc d MMM') }}
          </h2>
          <div>{{ performanceVenue(performance) }}</div>
          <div>Starting at {{ performance.start | dateFormat('T') }}</div>
          <div class="text-sm font-semibold">
            <p v-if="performanceDisabled(performance)">No Tickets Available</p>
            <p v-else>Tickets Available</p>
          </div>
          <button
            class="w-2/3 mt-4 font-semibold text-center btn btn-rouge btn-outline disabled"
            disabled
            v-if="performanceDisabled(performance)"
          >
            {{ disabledReason(performance) }}
          </button>
          <router-link
            to="/"
            class="w-2/3 mt-4 font-semibold text-center btn btn-orange"
            v-else
          >
            Book
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'production-performances',
  props: {
    production: {
      required: true,
    },
  },
  methods: {
    performanceDisabled(performance) {
      return performance.disabled || performance.sold_out;
    },
    disabledReason(performance) {
      if (performance.sold_out) return 'SOLD OUT';
      return 'Unavailable';
    },
    performanceVenue(performance) {
      if (performance.is_inperson && performance.is_online)
        return performance.venue.name + ' and Online';
      if (performance.is_online) return 'Online';
      return performance.venue.name;
    },
  },
};
</script>
