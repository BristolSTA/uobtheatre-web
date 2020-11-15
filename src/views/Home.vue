<template>
  <div class="home">
    <div
      id="splashscreen"
      :style="{
        'background-image': splashBackground,
      }"
    >
      <div class="bg-black bg-opacity-40 flex items-center">
        <div class="text-white container px-4 lg:w-2/3">
          <template v-if="featuredProduction">
            <div class="text-2xl">{{ featuredProduction.society.name }}</div>
            <div class="text-4xl">{{ featuredProduction.name }}</div>
            <div class="text-2xl">
              {{ featuredProduction.start_date | dateFormat('d MMMM') }} -
              {{ featuredProduction.end_date | dateFormat('d MMMM y') }}
            </div>
          </template>
          <template v-else>
            <div class="text-4xl">Welcome to UOB Theatre</div>
            <div class="text-2xl">
              The Home of Bristol Student Perfomring Arts
            </div>
          </template>
        </div>
      </div>
    </div>

    <h1>Productions</h1>
    <ul>
      <li v-for="production in upcomingProductions" :key="production.id">
        {{ production.name }} ({{ production.date }})
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
#splashscreen {
  background-image: url('~@/assets/images/placeholder-homepage-splash.jpg');
  background-size: cover;
  background-position: center;
  > div {
    min-height: 50vh;
  }
}
</style>

<script>
import { productionService } from '@/services';

export default {
  name: 'Home',
  data() {
    return {
      upcomingProductions: [],
    };
  },
  created() {
    productionService
      .fetchUpcomingProductions()
      .then((results) => (this.upcomingProductions = results));
  },
  computed: {
    featuredProduction() {
      return this.upcomingProductions.find((production) => {
        return !!production.cover_image;
      });
    },
    splashBackground() {
      return this.featuredProduction
        ? `url("${this.featuredProduction.cover_image}")`
        : null;
    },
  },
};
</script>
