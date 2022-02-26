<template>
  <div class="h-full">
    <!-- If no productions at this venue upcoming / bookable -->
    <div
      v-if="!marketableProductions.length"
      class="flex items-center h-screen justify-center"
    >
      <div class="px-4 text-white text-center space-y-10">
        <div class="text-6xl font-bold">
          Welcome to {{ venues.map((venue) => venue.name).join(' & ') }}
        </div>
        <div class="text-2xl">
          Check out
          <a class="text-sta-orange" href="/">uobtheatre.com</a> for all of our
          upcoming productions
        </div>
      </div>
    </div>
    <!-- with upcoming productions -->
    <div v-else class="flex flex-col p-4 h-full">
      <div class="flex h-2/3">
        <img
          :src="currentDisplayedProduction.featuredImage.url"
          class="h-full w-auto"
        />
        <div
          class="flex flex-col flex-grow items-center justify-evenly text-4xl"
        >
          <h2 class="text-5xl font-bold text-sta-orange">
            {{ currentDisplayedProduction.name }}
          </h2>
          <icon-list-item icon="clock">
            {{
              displayStartEnd(
                currentDisplayedProduction.start,
                currentDisplayedProduction.end,
                'd MMM'
              )
            }}</icon-list-item
          >
          <icon-list-item icon="map-marker">
            {{
              venues.find((venue) =>
                venue.productions.edges.find(
                  (edge) => edge.node.id == currentDisplayedProduction.id
                )
              ).name
            }}</icon-list-item
          >
        </div>
      </div>
      <div class="flex flex-grow items-center justify-between gap-x-20">
        <span class="text-5xl text-center">
          Book now at
          <span class="text-sta-orange">{{
            currentDisplayedProductionUrl
          }}</span>
        </span>
        <qrcode-vue
          :value="currentDisplayedProductionUrl"
          render-as="svg"
          level="L"
          background="transparent"
          foreground="white"
          class="h-full w-auto qrcode-responsive-height"
        />
      </div>
    </div>
  </div>
</template>

<script>
import VenueUpcomingProductionsQuery from '@/graphql/queries/venue/VenueUpcomingProductions.gql'
import { DateTime } from 'luxon'
import QrcodeVue from 'qrcode.vue'
import { displayStartEnd } from '@/utils'
import IconListItem from '@/components/ui/IconListItem.vue'

export default {
  components: { QrcodeVue, IconListItem },
  layout: 'publicityScreen',
  data() {
    return {
      productions: [],
      venues: [],
      dataFetchTimer: null,

      currentProductionIndex: 0,
      slideTimer: null,
    }
  },
  computed: {
    marketableProductions() {
      return this.productions.filter((production) => production.isBookable)
    },
    currentDisplayedProduction() {
      return this.marketableProductions
        ? this.marketableProductions[this.currentProductionIndex]
        : null
    },
    currentDisplayedProductionUrl() {
      return this.currentDisplayedProduction
        ? window.location.origin +
            this.$router.resolve({
              path: `/productions/${this.currentDisplayedProduction.slug}`,
            }).href
        : ''
    },
    productionsOnNow() {
      return this.productions.filter(
        (production) => production.performances.edges.length
      )
    },
  },
  mounted() {
    this.fetchData()
    this.dataFetchTimer = setInterval(this.fetchData, 7200000)
    this.slideTimer = setInterval(() => {
      if (
        this.currentProductionIndex + 1 >=
        this.marketableProductions.length
      ) {
        return (this.currentProductionIndex = 0)
      }
      this.currentProductionIndex += 1
    }, 1000 * 10)
  },
  destroyed() {
    clearInterval(this.dataFetchTimer)
    clearInterval(this.slideTimer)
  },
  methods: {
    displayStartEnd,
    async fetchData() {
      const slugs = this.$route.params.venueSlugs.split(',')
      const queries = []

      for (const slug of slugs) {
        queries.push(
          this.$apollo.query({
            query: VenueUpcomingProductionsQuery,
            variables: {
              slug,
              now: new Date(),
              nowDate: DateTime.now().toISODate(),
            },
            fetchPolicy: 'no-cache',
          })
        )
      }

      const queryData = await Promise.all(queries)
      this.productions = []
      this.venues = []
      this.currentProductionIndex = 0
      queryData.forEach((queryResult) => {
        if (queryResult.data.venue) {
          this.venues.push(queryResult.data.venue)
          this.productions.push(
            ...queryResult.data.venue.productions.edges.map((edge) => edge.node)
          )
        }
      })
    },
  },
}
</script>

<style lang="scss">
.qrcode-responsive-height > svg {
  width: auto !important;
  height: 100% !important;
}
</style>
