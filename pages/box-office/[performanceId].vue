<template>
  <NuxtPage
    ref="child"
    :performance="performance"
    @hook:mounted="regenerateCrumbsLink"
  />
</template>

<script>
import BoxOfficePerformance from '@/graphql/queries/box-office/BoxOfficePerformance.gql';
definePageMeta({
  middleware: ['authed']
});

export default defineNuxtComponent({
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
      return navigateTo('/404');
    }
    return {
      performance
    };
  },
  methods: {
    regenerateCrumbsLink() {
      this._computedWatchers.crumbs.run();
      this.$forceUpdate();
    }
  }
});
</script>
