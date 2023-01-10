<template>
  <div class="min-h-full bg-sta-gray">
    <Head>
      <Title>{{ production?.name ?? 'Loading...' }}</Title>
      <template v-if="production">
        <Meta name="description" :content="shortDescription" />
        <Meta name="og:title" :content="production.name" />
        <Meta name="og:description" :content="shortDescription" />
        <Meta
          v-if="production.featuredImage"
          name="og:image"
          :content="production.featuredImage.url"
        />
      </template>
    </Head>
    <div
      v-if="!production"
      class="justify-center py-20 text-center text-white text-xl font-semibold"
    >
      Loading Production...
    </div>
    <template v-else>
      <production-banner
        class="pb-12 pt-6"
        :production="production"
        @on-buy-tickets-click="$refs.performances.$el.scrollIntoView()"
      />
      <hr class="border-t-2 border-sta-gray-dark" />
      <div class="container my-6 text-white">
        <ul class="text-xl uppercase">
          <li
            class="inline-block font-semibold"
            :class="{
              'text-sta-rouge ': overview & hasCastCrew,
              'hover:text-sta-rouge': !overview
            }"
          >
            <clickable-link :disabled="!hasCastCrew" @click="overview = true">
              Overview
            </clickable-link>
          </li>
          <li
            v-if="hasCastCrew"
            class="inline-block ml-6 hover:text-sta-rouge font-semibold"
            :class="{ 'text-sta-rouge': !overview }"
          >
            <clickable-link :disabled="!hasCastCrew" @click="overview = false">
              Cast &amp; Credits
            </clickable-link>
          </li>
        </ul>

        <production-overview
          v-if="overview"
          ref="overview"
          :production="production"
        />
        <production-cast-credits
          v-else
          ref="cast-credits"
          :production="production"
        />
      </div>
      <hr class="border-t-2 border-sta-gray-dark" />
      <production-performances ref="performances" :production="production" />
    </template>
  </div>
</template>

<script>
import ProductionCastCredits from '@/components/production/ProductionCastCredits.vue';
import ProductionPerformances from '@/components/production/ProductionPerformances.vue';
import ProductionPageQuery from '@/graphql/queries/ProductionBySlug.gql';
import ProductionOverview from '@/components/production/ProductionOverview.vue';
import ClickableLink from '@/components/ui/ClickableLink.vue';

import ProductionBanner from '@/components/production/ProductionBanner.vue';
import { excerptFromDescription } from '~~/utils/production';
import { defineBreadcrumbs } from '~~/composables/defineBreadcrumbs';

export default defineNuxtComponent({
  components: {
    ProductionCastCredits,
    ProductionPerformances,
    ProductionOverview,
    ClickableLink,
    ProductionBanner
  },
  async asyncData() {
    // Execute query
    const result = await useAsyncQuery({
      query: ProductionPageQuery,
      variables: {
        slug: useRoute().params.slug
      }
    });

    const data = result.data;
    const production = data.value.production;
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
  data() {
    return {
      overview: true,
      production: null
    };
  },
  computed: {
    route() {
      return this.$route;
    },
    shortDescription() {
      return excerptFromDescription(this.production.description);
    },
    hasCastCrew() {
      return Boolean(
        this.production.crew.length ||
          this.production.cast.length ||
          this.production.productionTeam.length
      );
    }
  },
  setup() {
    const { breadcrumbs } = defineBreadcrumbs();
    return { breadcrumbs };
  },
  mounted() {
    this.breadcrumbs = [
      { text: 'Whats On', path: '/productions' },
      { text: this.production.name }
    ];
  }
});
</script>
