<template>
  <div class="container">
    <h1 class="py-4 text-h1">What's On</h1>
    <infinite-scroll
      :apollo-query="upcomingProductionsQuery"
      :apollo-variables="{ now: new Date() }"
      @new-data="handleNewData"
    >
      <div
        v-if="productions"
        class="grid gap-4 grid-cols-1 mb-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <production-tile
          v-for="(production, index) in productions"
          :key="index"
          :production="production"
        />
      </div>
    </infinite-scroll>

    <div
      v-if="productions && !productions.length"
      class="flex items-center text-center"
      style="height: 30vh"
    >
      <div class="w-full">
        <h2 class="text-h2">There are currently no upcoming productions</h2>
        <p>Please be sure to check back soon!</p>
      </div>
    </div>
  </div>
</template>

<script>
import ProductionTile from '@/components/production/ProductionTile.vue';
import InfiniteScroll from '@/components/ui/InfiniteScroll.vue';
import { UpcomingProductionsDocument } from '~~/graphql/codegen/operations';

export default defineNuxtComponent({
  components: { ProductionTile, InfiniteScroll },
  data() {
    return {
      productions: null,
      upcomingProductionsQuery: UpcomingProductionsDocument
    };
  },
  head: {
    title: 'Upcoming Productions'
  },
  methods: {
    handleNewData(data) {
      if (!this.productions) {
        this.productions = [];
      }
      this.productions.push(...data.edges.map((edge) => edge.node));
    }
  }
});
</script>
