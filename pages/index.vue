<template>
  <div>
    <div id="splashscreen">
      <div
        v-if="!bannerProductions.length"
        class="flex items-center bg-black bg-opacity-40"
        style="min-height: 50vh"
      >
        <div class="container px-4 text-white lg:w-2/3">
          <div class="text-4xl">Welcome to {{ $appName }}</div>
          <div class="text-2xl">
            The Home of Bristol Student Performing Arts
          </div>
        </div>
      </div>
      <carousel v-else :carousel-productions="bannerProductions" />
    </div>

    <div ref="whatson" class="container mt-4 text-white">
      <h1 class="text-h1">What's On</h1>
      <div
        v-for="(production, index) in upcomingProductionsToShow"
        :key="production.id"
        class="production-feature flex flex-wrap items-center py-4"
        :class="{ 'flex-row-reverse': index % 2 == 1 }"
      >
        <div
          class="p-2 w-full text-center md:px-6 md:w-1/2"
          :class="[index % 2 == 0 ? 'md:text-right' : 'md:text-left']"
        >
          <NuxtLink :to="`/production/${production.slug}`">
            <img
              :src="production.featuredImage.url"
              :alt="`${production.name} feature image`"
              class="inline-block"
              style="max-height: 300px"
            />
          </NuxtLink>
        </div>
        <div
          class="p-2 w-full text-center md:px-6 md:w-1/2"
          :class="[index % 2 == 0 ? 'md:text-left' : 'md:text-right']"
        >
          <NuxtLink :to="`/production/${production.slug}`">
            <h2 class="hover:text-gray-300 text-h2 font-semibold">
              {{ production.name }}
            </h2>
          </NuxtLink>
          <span v-if="production.subtitle">{{ production.subtitle }}</span>
          <p class="text-sta-orange font-semibold">
            {{ displayStartEnd(production.start, production.end, 'd MMMM') }}
          </p>
          <p class="m-2">
            {{ production.description | truncate(230) }}
          </p>
          <NuxtLink
            :to="`/production/${production.slug}`"
            class="btn btn-rouge mt-6"
          >
            More Information & Book
          </NuxtLink>
        </div>
      </div>
      <div
        v-if="upcomingProductions.length == 0"
        class="flex items-center text-center"
        style="height: 30vh"
      >
        <div class="w-full">
          <h2 class="text-h2">There are currently no upcoming productions</h2>
          <p>Please be sure to check back soon!</p>
        </div>
      </div>
      <div
        v-if="upcomingProductions.length > upcomingProductionsToShow.length"
        class="flex items-center py-10 text-center"
      >
        <div class="w-full">
          <NuxtLink to="/productions" class="btn btn-outline btn-orange">
            See More <font-awesome-icon icon="arrow-right" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import lo from 'lodash'

import Carousel from '@/components/ui/Carousel.vue'
import { displayStartEnd } from '@/utils'

export default {
  components: { Carousel },
  data() {
    return {
      upcomingProductions: [],
      displayStartEnd,
    }
  },
  head() {
    const appName = this.$appName
    return {
      title: `${appName} | The Home Of Bristol Student Performing Arts`,
      titleTemplate: null,
    }
  },
  apollo: {
    upcomingProductions: {
      query: require('@/graphql/queries/HomeUpcomingProductions.gql'),
      update: (data) => data.productions.edges.map((edge) => edge.node),
      variables() {
        return {
          now: new Date(),
        }
      },
    },
  },
  computed: {
    bannerProductions() {
      return this.upcomingProductionsToShow.filter((production) => {
        return !!production.coverImage
      })
    },
    upcomingProductionsToShow() {
      return lo.take(this.upcomingProductions, 4)
    },
  },
}
</script>

<style>
#splashscreen {
  background-image: url('~@/assets/images/placeholder-homepage-splash.jpg');
  background-size: cover;
  background-position: center;
}
</style>
