<template>
  <div class="home">
    <div>
      <div
        id="splashscreen"
        :style="{
          'background-image':
            productions.length > 0
              ? `url(${productions[0].cover_image} )`
              : null,
        }"
      >
        <div class="bg-black bg-opacity-40 flex items-center">
          <div class="text-white container px-4 lg:w-2/3">
            <template v-if="productions.length > 0">
              <div class="text-2xl">{{ productions[0].society.name }}</div>
              <div class="text-4xl">{{ productions[0].name }}</div>
              <div class="text-2xl">
                {{ productions[0].start_date | dateFormat('d MMMM') }} -
                {{ productions[0].end_date | dateFormat('d MMMM y') }}
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
    </div>

    <h1>Productions</h1>
    <ul>
      <li v-for="production in productions" :key="production.id">
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
      productions: [],
    };
  },
  created() {
    productionService
      .fetchUpcomingProductions()
      .then((data) => (this.productions = data.results));
  },
};
</script>
