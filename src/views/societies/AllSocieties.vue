<template>
  <div class="min-h-full text-white bg-sta-gray">
    <div class="container">
      <h1 class="py-4 text-h1">Societies</h1>
      <div class="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 lg:grid-cols-3">
        <society-tile
          v-for="(society, index) in societies"
          :key="index"
          :society="society"
        />
      </div>
      <p
        v-if="endCursor || $apollo.queries.societies.loading"
        ref="bottom-loader"
        class="pb-4 text-4xl text-center"
      >
        <font-awesome-icon icon="circle-notch" class="animate-spin" />
      </p>
      <div
        v-if="societies.length == 0 && !$apollo.queries.societies.loading"
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
export default {
  name: 'AllSocieties',
  components: { SocietyTile },
  metaInfo: {
    title: 'Societies',
  },
  data() {
    return {
      societies: [],
      endCursor: null,
    };
  },
  mounted() {
    this.societies = [];
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      if (this.$apollo.queries.societies.loading) return;
      let bottomLoaderEl = this.$refs['bottom-loader'];
      if (
        bottomLoaderEl &&
        bottomLoaderEl.offsetTop <= window.scrollY + window.innerHeight
      ) {
        this.$apollo.queries.societies.fetchMore({
          variables: {
            afterCursor: this.endCursor,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            this.handleNewSocieties(fetchMoreResult);
          },
        });
      }
    },
    handleNewSocieties(data) {
      this.societies.push(...data.societies.edges.map((edge) => edge.node));
      this.endCursor = data.societies.pageInfo.hasNextPage
        ? data.societies.pageInfo.endCursor
        : null;
    },
  },
  apollo: {
    societies: {
      query: require('@/graphql/queries/AllSocieties.gql'),
      manual: true,
      result(result) {
        this.handleNewSocieties(result.data);
      },
    },
  },
};
</script>
