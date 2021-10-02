<template>
  <div v-if="!publicityImages.length" class="flex items-center h-screen">
    <div class="container px-4 text-white lg:w-2/3">
      <div class="text-4xl">Welcome to {{ $appName }}</div>
      <div class="text-2xl">The Home of Bristol Student Performing Arts</div>
    </div>
  </div>
  <carousel
    v-else
    :carousel-productions="publicityImages"
    :vheight="100"
    :nav-arrows="false"
    :production-info="false"
    :pause-on-hover="false"
    :autoplay-speed="10000"
  />
</template>

<script>
import Carousel from '@/components/ui/Carousel.vue'

export default {
  components: { Carousel },
  layout: 'publicityscreen',
  data() {
    return {
      upcomingProductions: [],
    }
  },
  apollo: {
    upcomingProductions: {
      query: require('@/graphql/queries/PublicityScreenProductions.gql'),
      update: (data) => data.productions.edges.map((edge) => edge.node),
      variables() {
        return {
          now: new Date(),
        }
      },
      // refresh every 2 hours
      pollInterval: 7200000,
    },
  },
  computed: {
    publicityImages() {
      return this.upcomingProductions.filter((production) => {
        return !!production.coverImage
      })
    },
  },
}
</script>
