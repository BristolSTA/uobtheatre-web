<template>
  <div class="min-h-full text-white bg-sta-gray">
    <div class="container">
      <h1 class="py-4 text-h1">Whats On</h1>
      <div class="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 lg:grid-cols-3">
        <production-tile
          v-for="(production, i) in productions"
          :key="i"
          :production="production"
        />
      </div>
      <p
        v-if="endCursor || $apollo.queries.productions.loading"
        ref="bottom-loader"
        class="pb-4 text-4xl text-center"
      >
        <font-awesome-icon icon="circle-notch" class="animate-spin" />
      </p>
      <div
        v-if="productions.length == 0 && !$apollo.queries.productions.loading"
        class="flex items-center text-center"
        style="height: 30vh"
      >
        <div class="w-full">
          <h2 class="text-h2">There are currently no upcoming productions</h2>
          <p>Please be sure to check back soon!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductionTile from '@/components/production/ProductionTile.vue';
export default {
  name: 'Production',
  components: { ProductionTile },
  metaInfo: {
    title: 'Upcoming Productions',
  },
  data() {
    return {
      productions: [],
      endCursor: null,
    };
  },
  mounted() {
    this.productions = [];
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      if (this.$apollo.queries.productions.loading) return;
      let bottomLoaderEl = this.$refs['bottom-loader'];
      if (
        bottomLoaderEl &&
        bottomLoaderEl.offsetTop <= window.scrollY + window.innerHeight
      ) {
        this.$apollo.queries.productions.fetchMore({
          variables: {
            afterCursor: this.endCursor,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            this.handleNewProductions(fetchMoreResult);
          },
        });
      }
    },
    handleNewProductions(data) {
      this.productions.push(...data.productions.edges.map((edge) => edge.node));
      this.endCursor = data.productions.pageInfo.hasNextPage
        ? data.productions.pageInfo.endCursor
        : null;
    },
  },
  apollo: {
    productions: {
      query: require('@/graphql/queries/UpcomingProductions.gql'),
      manual: true,
      result(result) {
        this.handleNewProductions(result.data);
      },
    },
  },
};
</script>
