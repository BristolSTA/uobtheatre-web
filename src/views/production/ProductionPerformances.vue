<template>
  <div class="container my-6 text-white">
    <div class="text-center">
      <h1 class="text-h2">
        Dates and Times
      </h1>
    </div>
    <div
      v-if="!production.performances.edges.length"
      class="my-20 text-xl text-center"
    >
      No Upcoming Performances
    </div>
    <div
      v-else
      class="flex flex-wrap justify-center"
    >
      <div
        v-for="performance in production.performances.edges.map(
          (edge) => edge.node
        )"
        :key="performance.id"
        class="w-full performance md:w-1/2 lg:w-1/3 2xl:w-1/4"
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
          <div>
            <router-link
              v-if="performance.isInperson"
              class="hover:text-gray-200"
              :to="{
                name: 'venue',
                params: { venueSlug: performance.venue.slug },
              }"
            >
              {{ performance.venue.name }}
            </router-link>
            <template v-if="performance.isOnline && performance.isInperson">
              and
            </template>
            <template v-if="performance.isOnline">
              Online
            </template>
          </div>
          <div>Starting at {{ performance.start | dateFormat('T') }}</div>
          <div class="text-sm font-semibold">
            <p v-if="performanceDisabled(performance)">
              No Tickets Available
            </p>
            <p v-else>
              Tickets Available
            </p>
          </div>
          <button
            v-if="performanceDisabled(performance)"
            class="w-2/3 mt-4 font-semibold text-center btn btn-rouge btn-outline disabled"
            disabled
          >
            {{ disabledReason(performance) }}
          </button>
          <router-link
            v-else
            to="/"
            class="w-2/3 mt-4 font-semibold text-center btn btn-orange"
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
  name: 'ProductionPerformances',
  props: {
    production: {
      required: true,
      type: Object,
    },
  },
  methods: {
    performanceDisabled(performance) {
      return performance.soldOut;
    },
    disabledReason(performance) {
      if (performance.soldOut) return 'SOLD OUT';
      return 'Unavailable';
    },
  },
};
</script>
