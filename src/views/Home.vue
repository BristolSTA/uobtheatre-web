<template>
  <div class="min-h-full bg-sta-gray">
    <template v-if="!bannerProductions.length">
      <div class="text-4xl">Welcome to {{ $appName }}</div>
      <div class="text-2xl">The Home of Bristol Student Performing Arts</div>
    </template>
    <template v-else>
      <agile :options="carouselOptions">
        <div
          v-for="(bannerProduction, index) in bannerProductions"
          :key="index"
          ref="banner-slide"
        >
          <div
            id="splashscreen"
            :style="{
              'background-image': bannerBackgorund(bannerProduction),
            }"
          >
            <div class="flex items-center bg-black bg-opacity-40">
              <div class="container px-4 text-white lg:w-2/3">
                <div class="text-2xl">
                  {{ bannerProduction.society.name }}
                </div>
                <div class="text-h1">{{ bannerProduction.name }}</div>
                <div class="text-2xl">
                  {{ bannerProduction.start | dateFormat('d MMMM') }} -
                  {{ bannerProduction.end | dateFormat('d MMMM y') }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <template slot="prevButton">
          <font-awesome-icon icon="chevron-left" />
        </template>
        <template slot="nextButton">
          <font-awesome-icon icon="chevron-right" />
        </template>
      </agile>
    </template>

    <div class="container mt-4 text-white" ref="whatson">
      <h1 class="text-h1">What's On</h1>
      <div
        v-for="(production, index) in upcomingProductionsToShow"
        :key="production.id"
        class="flex flex-wrap items-center py-4 production-feature"
        :class="{ 'flex-row-reverse': index % 2 == 1 }"
      >
        <div
          class="w-full p-2 text-center md:w-1/2 md:px-6"
          :class="[index % 2 == 0 ? 'md:text-right' : 'md:text-left']"
        >
          <router-link
            :to="{
              name: 'production',
              params: { productionSlug: production.slug },
            }"
          >
            <img
              :src="production.featuredImage.url"
              :alt="`${production.name} feature image`"
              class="inline-block"
              style="max-height: 300px"
            />
          </router-link>
        </div>
        <div
          class="w-full p-2 text-center md:w-1/2 md:px-6"
          :class="[index % 2 == 0 ? 'md:text-left' : 'md:text-right']"
        >
          <router-link
            :to="{
              name: 'production',
              params: { productionSlug: production.slug },
            }"
            ><h2 class="font-semibold text-h2 hover:text-gray-300">
              {{ production.name }}
            </h2>
          </router-link>
          <span v-if="production.subtitle">{{ production.subtitle }}</span>
          <p class="font-semibold text-sta-orange">
            {{ displayStartEnd(production.start, production.end, 'd MMMM') }}
          </p>
          <p class="mt-2">
            {{ production.description | truncate(230) }}
          </p>
          <router-link
            :to="{
              name: 'production',
              params: { productionSlug: production.slug },
            }"
            class="mt-6 btn btn-rouge"
            >More Information
          </router-link>
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
          <router-link to="/" class="btn btn-outline btn-orange"
            >View All Upcoming Productions
          </router-link>
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
import lo from 'lodash';
import { VueAgile } from 'vue-agile';

import { displayStartEnd } from '@/utils';

export default {
  name: 'Home',
  components: { agile: VueAgile },
  data() {
    return {
      upcomingProductions: [],
      displayStartEnd: displayStartEnd,
      carouselOptions: {
        navButtons: false,
        autoplay: true,
        autoplaySpeed: 8000,
        speed: 1000,
        fade: true,
        responsive: [
          {
            breakpoint: 700,
            settings: {
              navButtons: true,
            },
          },
        ],
      },
    };
  },
  apollo: {
    upcomingProductions: {
      query: require('./HomeUpcomingProductions.gql'),
      update: (data) => data.productions.edges.map((edge) => edge.node),
    },
  },
  computed: {
    bannerProductions() {
      return this.upcomingProductionsToShow.filter((production) => {
        return !!production.coverImage;
      });
    },
    upcomingProductionsToShow() {
      return lo.take(this.upcomingProductions, 4);
    },
  },
  methods: {
    bannerBackgorund(bannerProduction) {
      return `url("${bannerProduction.coverImage.url}")`;
    },
  },
};
</script>

<style lang="sass">
.agile
	&__nav-button
		background: transparent
		color: #fff
		cursor: pointer
		font-size: 24px
		height: 100%
		position: absolute
		top: 0
		transition-duration: .3s
		width: 60px

		&:hover
			background-color: rgba(#000, .5)
			opacity: 1

		&--prev
			left: 0

		&--next
			right: 0

	&__dots
		bottom: 10px
		left: 50%
		position: absolute
		transform: translateX(-50%)

	&__dot
		margin: 0 10px

		button
			background-color: transparent
			border: 1px solid #fff
			border-radius: 50%
			cursor: pointer
			display: block
			height: 10px
			transition-duration: .3s
			width: 10px

		&--current,
		&:hover
			button
				background-color: #fff
</style>
