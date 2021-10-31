<template>
  <div v-if="!publicityImages.length" class="flex items-center h-screen">
    <div class="container px-4 text-white lg:w-2/3">
      <div class="text-4xl text-h1">Welcome to {{ $appName }}</div>
      <div class="text-2xl">
        Check out <a class="text-sta-orange" href="/">www.uobtheatre.com</a> for
        all upcoming productions
      </div>
    </div>
  </div>
  <carousel
    v-else
    :carousel-items="publicityImages"
    :vheight="100"
    :nav-arrows="false"
    :pause-on-hover="false"
    :autoplay-speed="10000"
  >
    <template #default="slotProps">
      <div
        v-if="!!slotProps.carouselItem.text"
        class="flex items-center h-full bg-black bg-opacity-40"
      >
        <div class="container px-4 md:pl-12 lg:pl-4 lg:w-2/3">
          <div v-if="slotProps.carouselItem.text.society" class="text-2xl">
            {{ slotProps.carouselItem.text.society.name }}
          </div>
          <div v-if="slotProps.carouselItem.text.name" class="text-h1">
            {{ slotProps.carouselItem.text.name }}
          </div>
          <div v-if="slotProps.carouselItem.text.start" class="text-2xl">
            {{ slotProps.carouselItem.text.start | dateFormat('d MMMM') }} -
            {{ slotProps.carouselItem.text.end | dateFormat('d MMMM y') }}
          </div>
        </div>
      </div>
    </template>
  </carousel>
</template>

<script>
import Carousel from '@/components/ui/Carousel.vue'

export default {
  components: { Carousel },
  layout: 'publicityScreen',
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
      return this.upcomingProductions
        .map((prod) => {
          if (prod.coverImage) {
            return {
              id: prod.id,
              displayImage: prod.coverImage,
              text: { name: prod.name },
            }
          } else if (prod.featuredImage) {
            return {
              id: prod.id,
              displayImage: prod.featuredImage,
              text: null,
            }
          } else {
            return {
              id: null,
              text: null,
            }
          }
        })
        .filter((prod) => {
          return !!prod.id
        })
    },
  },
}
</script>
