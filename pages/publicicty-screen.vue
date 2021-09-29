<template>
  <div v-if="!publicityImages.length" class="flex items-center h-screen">
    <div class="container px-4 text-white lg:w-2/3">
      <div class="text-4xl">Welcome to {{ $appName }}</div>
      <div class="text-2xl">The Home of Bristol Student Performing Arts</div>
    </div>
  </div>
  <publicity-carousel v-else :publicity-images="publicityImages" />
</template>

<script>
import PublicityCarousel from '@/components/layout/PublicityCarousel.vue'

export default {
  components: { PublicityCarousel },
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
