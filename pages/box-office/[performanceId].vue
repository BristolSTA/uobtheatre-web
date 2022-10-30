<template>
  <NuxtChild
    ref="child"
    :performance="performance"
    @hook:mounted="regenerateCrumbsLink"
  />
</template>

<script>
import BoxOfficePerformance from '@/graphql/queries/box-office/BoxOfficePerformance.gql';
export default {
  middleware: 'authed',
  async asyncData({ params, error, app }) {
    // Execute query
    const { data } = await app.apolloProvider.defaultClient.query({
      query: BoxOfficePerformance,
      variables: {
        id: params.performanceId
      }
    });

    const performance = data.performance;
    if (!performance) {
      return error({
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
};
</script>
