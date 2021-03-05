<template>
  <div class="min-h-full text-white bg-sta-gray">
    <div class="container">
      <h1 class="py-4 text-h1">Societies</h1>
      <infinite-scroll
        :apollo-query="require('@/graphql/queries/AllSocieties.gql')"
        @newData="handleNewData"
      >
        <div class="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 lg:grid-cols-3">
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
          <p>Loading Societies</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SocietyTile from '@/components/society/SocietyTile.vue';
import InfiniteScroll from '@/components/ui/InfiniteScroll.vue';
export default {
  name: 'AllSocieties',
  components: { SocietyTile, InfiniteScroll },
  metaInfo: {
    title: 'Societies',
  },
  data() {
    return {
      societies: null,
    };
  },
  methods: {
    handleNewData(data) {
      console.log(data);
      if (!this.societies) this.societies = [];
      this.societies.push(...data.edges.map((edge) => edge.node));
    },
  },
};
</script>
