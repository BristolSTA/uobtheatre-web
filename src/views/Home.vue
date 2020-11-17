<template>
  <div class="bg-sta-gray min-h-full">
    <div
      id="splashscreen"
      :style="{
        'background-image': splashBackground,
      }"
    >
      <div class="bg-black bg-opacity-40 flex items-center">
        <div class="text-white container px-4 lg:w-2/3">
          <router-link
            v-if="featuredProduction"
            :to="{
              name: 'production',
              params: { productionSlug: featuredProduction.slug },
            }"
          >
            <div class="text-2xl">{{ featuredProduction.society.name }}</div>
            <div class="text-h1">{{ featuredProduction.name }}</div>
            <div class="text-2xl">
              {{ featuredProduction.start_date | dateFormat('d MMMM') }} -
              {{ featuredProduction.end_date | dateFormat('d MMMM y') }}
            </div>
          </router-link>
          <template v-else>
            <div class="text-4xl">Welcome to {{ $appName }}</div>
            <div class="text-2xl">
              The Home of Bristol Student Performing Arts
            </div>
          </template>
        </div>
      </div>
    </div>

    <div class="container text-white mt-4" ref="whatson">
      <h1 class="text-h1">What's On</h1>
      <div
        v-for="(production, index) in upcomingProductionsToShow"
        :key="production.id"
        class="production-feature py-4 flex flex-wrap items-center"
        :class="{ 'flex-row-reverse': index % 2 == 1 }"
      >
        <div class="w-full md:w-1/2 text-center p-2">
          <router-link
            :to="{
              name: 'production',
              params: { productionSlug: production.slug },
            }"
          >
            <img
              :src="production.featured_image"
              :alt="`${production.name} Poster Image`"
              class="inline-block"
              style="max-height: 300px"
          /></router-link>
        </div>
        <div
          class="w-full md:w-1/2 p-2 text-center"
          :class="[index % 2 == 0 ? 'md:text-left' : 'md:text-right']"
        >
          <router-link
            :to="{
              name: 'production',
              params: { productionSlug: production.slug },
            }"
            ><h2 class="text-h2 font-semibold hover:text-gray-300">
              {{ production.name }}
            </h2></router-link
          >
          <span v-if="production.subtitle">{{ production.subtitle }}</span>
          <p class="text-sta-orange font-semibold">
            {{ production.start_date | dateFormat('d MMMM') }} -
            {{ production.end_date | dateFormat('d MMMM y') }}
          </p>
          <p class="mt-2">
            {{ production.description | truncate(230) }}
          </p>
          <router-link
            :to="{
              name: 'production',
              params: { productionSlug: production.slug },
            }"
            class="btn btn-rouge mt-6 inline-block"
            >More Information</router-link
          >
        </div>
      </div>
      <div
        v-if="upcomingProductions.length == 0"
        class="text-center flex items-center"
        style="height: 30vh"
      >
        <div class="w-full">
          <h2 class="text-h2">There are currently no upcoming productions</h2>
          <p>Please be sure to check back soon for more original content</p>
        </div>
      </div>
      <div
        v-if="upcomingProductions.length > upcomingProductionsToShow.length"
        class="text-center flex items-center py-10"
      >
        <div class="w-full">
          <router-link to="/" class="btn btn-outline btn-orange"
            >View All Upcoming Productions</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#splashscreen {
  background-image: url('~@/assets/images/placeholder-homepage-splash.jpg');
  background-size: cover;
  background-position: center;
  > div {
    min-height: 50vh;
  }
}
</style>

<script>
import { productionService } from '@/services';
import lo from 'lodash';

export default {
  name: 'Home',
  data() {
    return {
      upcomingProductions: [],
    };
  },
  /* istanbul ignore next */
  metaInfo() {
    const appName = this.$appName;
    return {
      title: `${appName} | The Home Of Bristol Student Performing Arts`,
      titleTemplate: null,
    };
  },
  created() {
    productionService
      .fetchUpcomingProductions()
      .then((results) => (this.upcomingProductions = results));
  },
  computed: {
    featuredProduction() {
      return this.upcomingProductions.find((production) => {
        return !!production.cover_image;
      });
    },
    upcomingProductionsToShow() {
      return lo.take(this.upcomingProductions, 4);
    },
    splashBackground() {
      return this.featuredProduction
        ? `url("${this.featuredProduction.cover_image}")`
        : null;
    },
  },
};
</script>
