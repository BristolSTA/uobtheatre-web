<template>
  <div class="container">
    <h1 class="py-4 text-h1">Whats On</h1>
    <infinite-scroll
      :apollo-query="require('@/graphql/queries/UpcomingProductions.gql')"
      @newData="handleNewData"
    >
      <div
        v-if="productions"
        class="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 lg:grid-cols-3"
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
import ProductionTile from '@/components/production/ProductionTile.vue'
import InfiniteScroll from '@/components/ui/InfiniteScroll.vue'
export default {
  components: { ProductionTile, InfiniteScroll },
  middleware: 'authed',
  data() {
    return {
      productions: null,
    }
  },
  head: {
    title: 'Upcoming Productions',
  },
  methods: {
    handleNewData(data) {
      if (!this.productions) this.productions = []
      this.productions.push(...data.edges.map((edge) => edge.node))
    },
  },
}
</script>
