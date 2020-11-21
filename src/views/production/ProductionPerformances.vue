<template>
  <div class="text-white container my-6">
    <div class="text-center"><h1 class="text-h2">Dates and Times</h1></div>
    <div class="flex flex-wrap justify-center">
      <div
        class="w-full md:w-1/2 lg:w-1/3 2xl:w-1/4"
        v-for="performance in production.performances"
        :key="performance.id"
      >
        <div
          class="p-3 pt-1 m-2 font-semibold"
          :class="[performance.sold_out ? 'bg-sta-gray-dark' : 'bg-sta-green']"
        >
          <h2 class="text-h2">
            {{ performance.start | dateFormat('cccc d MMM') }}
          </h2>
          <div>{{ performance.venue.name }}</div>
          <div>Starting at {{ performance.start | dateFormat('T') }}</div>
          <div class="text-sm">
            <p v-if="performance.sold_out">No Tickets Avaliable</p>
            <p v-else>Tickets Avaliable</p>
          </div>
          <button
            class="btn w-2/3 font-semibold text-center mt-4 btn-rouge btn-outline"
            v-if="performance.sold_out"
            disabled="true"
          >
            <p>SOLD OUT</p>
          </button>
          <router-link
            to="/"
            class="btn w-2/3 font-semibold text-center mt-4 btn-orange"
            v-else
          >
            <p>Book</p>
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
};
</script>
