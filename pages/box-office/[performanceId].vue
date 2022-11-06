<template>
  <NuxtChild
    ref="child"
    :performance="performance"
    @hook:mounted="regenerateCrumbsLink"
  />
</template>

<script>
import BoxOfficePerformance from '@/graphql/queries/box-office/BoxOfficePerformance.gql';
export default defineNuxtComponent({
  middleware: 'authed',
  async asyncData() {
    // Execute query
    const { data } = await useDefaultApolloClient().query({
      query: BoxOfficePerformance,
      variables: {
        id: useRoute().params.performanceId
      }
    });

    const performance = data.performance;
    if (!performance) {
      throw createError(rror({
        statusCode: 404,
        message: 'This performance does not exist'
      });
    }
    return {
      performance
    };
  },
  computed: {
    crumbs() {
      return this.$refs.child.crumbs;
    }
  },
  methods: {
    regenerateCrumbsLink() {
      this._computedWatchers.crumbs.run();
      this.$forceUpdate();
    }
  }
});
</script>
