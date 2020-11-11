<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <h1>Productions</h1>
    <ul>
      <li v-for="production in productions" :key="production.id">
        {{ production.name }} ({{ production.date }})
      </li>
    </ul>
  </div>
</template>

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
      .fetchProductions()
      .then((data) => (this.productions = data.results));
  },
};
</script>
