<template>
  <AdminPage title="Create a Booking">
    <p>Select a performance below to create a complimentry booking for.</p>

    <loading-container :loading="$apollo.queries.performancesData.loading">
      <template v-if="performancesData">
        <time-grouped-performance-selector
          :performances="performancesData.edges.map((edge) => edge.node)"
          @select-performance="useRouter().push(`create/${$event.id}`)"
        />
        <div class="flex justify-center">
          <pagination-bar
            class="mx-auto"
            :current-offset="performancesOffset"
            :page-info="performancesData.pageInfo"
            :disabled="$apollo.queries.performancesData.loading"
            @previous-page="
              performancesOffset = Math.max(
                0,
                performancesOffset - performancesData.edges.length
              )
            "
            @next-page="performancesOffset += performancesData.edges.length"
          />
        </div>
      </template>
    </loading-container>
  </AdminPage>
</template>

<script>
import AdminPerformancesIndexQuery from '@/graphql/queries/admin/productions/AdminPerformancesIndex.gql';
import AdminProductionLookupQuery from '@/graphql/queries/admin/productions/AdminProductionLookup.gql';

import PaginationBar from '@/components/ui/PaginationBar.vue';
import LoadingContainer from '@/components/ui/LoadingContainer.vue';
import TimeGroupedPerformanceSelector from '@/components/performance/TimeGroupedPerformanceSelector.vue';

export default defineNuxtComponent({
  components: {
    AdminPage,
    PaginationBar,
    LoadingContainer,
    TimeGroupedPerformanceSelector
  },
  async asyncData() {
    // Execute query
    const { data } = await useDefaultApolloClient().query({
      query: AdminProductionLookupQuery,
      variables: {
        slug: useRoute().params.productionSlug
      }
    });

    const production = data.production;
    if (!production) {
      throw createSafeError({
        statusCode: 404,
        message: 'This production does not exist'
      });
    }
    return {
      production
    };
  },
  apollo: {
    performancesData: {
      query: AdminPerformancesIndexQuery,
      variables() {
        return {
          productionSlug: this.production.slug,
          offset: this.performancesOffset,
          soldOut: false,
          disabled: false,
          take: 8
        };
      },
      update: (data) => data.production.performances
    }
  },
  data() {
    return {
      production: null,

      performancesData: null,
      performancesOffset: 0
    };
  }
});
</script>
