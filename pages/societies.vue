<template>
  <div class="min-h-full text-white bg-sta-gray">
    <div class="container">
      <h1 class="py-4 text-h1">Societies</h1>
      <infinite-scroll :apollo-query="query" @new-data="handleNewData">
        <div
          class="grid gap-4 mb-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          <society-tile
            v-for="(society, index) in societies"
            :key="index"
            :society="society"
          />
        </div>
      </infinite-scroll>
      <div
        v-if="societies && !societies.length"
        class="flex items-center text-center"
        style="height: 30vh"
      >
        <div class="w-full">
          <h2 class="text-h2">There are currently no societies</h2>
          <p>Please be sure to check back soon!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SocietyTile from '@/components/society/SocietyTile.vue';
import InfiniteScroll from '@/components/ui/InfiniteScroll.vue';
import { AllSocietiesDocument } from '~~/graphql/codegen/operations';

export default defineNuxtComponent({
  components: { SocietyTile, InfiniteScroll },
  data() {
    return {
      societies: null,
      query: AllSocietiesDocument
    };
  },
  head: {
    title: 'Societies'
  },
  methods: {
    handleNewData(data) {
      if (!this.societies) {
        this.societies = [];
      }
      this.societies.push(...data.edges.map((edge) => edge.node));
    }
  }
});
</script>
