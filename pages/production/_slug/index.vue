<template>
  <div class="min-h-full bg-sta-gray">
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
              'hover:text-sta-rouge': !overview,
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
import ProductionCastCredits from '@/components/production/ProductionCastCredits.vue'
import ProductionPerformances from '@/components/production/ProductionPerformances.vue'
import ProductionPageQuery from '@/graphql/queries/ProductionBySlug.gql'
import ProductionOverview from '@/components/production/ProductionOverview.vue'
import ClickableLink from '@/components/ui/ClickableLink.vue'

import { oneLiner } from '@/utils/lang.js'
import ProductionBanner from '@/components/production/ProductionBanner.vue'

export default {
  components: {
    ProductionCastCredits,
    ProductionPerformances,
    ProductionOverview,
    ClickableLink,
    ProductionBanner,
  },
  async asyncData({ params, error, app }) {
    // Execute query
    const { data } = await app.apolloProvider.defaultClient.query({
      query: ProductionPageQuery,
      variables: {
        slug: params.slug,
      },
    })

    const production = data.production
    if (!production)
      return error({
        statusCode: 404,
        message: 'This production does not exist',
      })
    return {
      production,
    }
  },
  data() {
    return {
      overview: true,
    }
  },
  head() {
    const productionName = this.production ? this.production.name : 'Loading...'
    const meta = []
    if (this.production) {
      const description = oneLiner(
        this.$options.filters.truncate(this.production.description, 100)
      )
      meta.push(
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: productionName,
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: description,
        }
      )
      if (this.production.featuredImage) {
        meta.push({
          hid: 'og:image',
          name: 'og:image',
          content: this.production.featuredImage.url,
        })
      }
    }
    return {
      title: `${productionName}`,
      meta,
    }
  },
  computed: {
    route() {
      return this.$route
    },
    crumbs() {
      return [
        { text: 'Whats On', path: '/productions' },
        { text: this.production.name },
      ]
    },
    hasCastCrew() {
      return Boolean(
        this.production.crew.length ||
          this.production.cast.length ||
          this.production.productionTeam.length
      )
    },
  },
}
</script>
