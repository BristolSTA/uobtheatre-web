<template>
  <div class="home">
  <div>
    <div id="splashscreen">
      <div class="bg-black bg-opacity-40 flex items-center">
        <div class=" text-white container px-4 lg:w-2/3">
          <div class="text-2xl">{{ productions[0].society.name }}</div> <!-- API input -->
          <div class="text-4xl">{{ productions[0].name }}</div>
          <div class="text-2xl">18 July - 22 July 2020</div>
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
    background-image: url('~@/assets/images/placeholder-homepage-splash.jpg'); /*placeholder -API input */
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
