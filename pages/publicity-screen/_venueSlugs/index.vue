<template>
  <div class="h-full">
    <!-- If no productions at this venue upcoming / bookable -->
    <template v-if="productionsOnNow.length">
      <component
        :is="currentScreen"
        :production="productionsOnNow[onNowProductionIndex]"
        :performance="
          productionsOnNow[onNowProductionIndex].performances.edges[0].node
        "
      />
    </template>

    <!-- with upcoming productions -->
    <div
      v-else-if="marketableProductions.length"
      class="flex flex-col p-4 gap-2 h-full overflow-hidden"
    >
      <div class="flex h-2/3 gap-4">
        <div class="flex items-center justify-center">
          <img
            :src="currentDisplayedProduction.featuredImage.url"
            class="w-auto max-h-full"
          />
        </div>
        <div
          class="flex flex-col flex-grow items-center justify-evenly text-rsm"
        >
          <h2 class="text-rmd font-bold text-sta-orange text-center">
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
        <span class="text-rmd text-center">
          Book now at
          <span class="text-sta-orange">{{
            currentDisplayedProductionUrl
          }}</span>
        </span>
        <qrcode-vue
          :value="
            currentDisplayedProductionUrl + '?utm_medium=publicity-screen'
          "
          render-as="svg"
          level="L"
          background="transparent"
          foreground="white"
          class="qrcode-responsive-height h-full"
        />
      </div>
    </div>

    <div v-else class="flex items-center h-screen justify-center">
      <div class="px-4 text-white text-center space-y-10">
        <div class="text-rxl font-bold">
          Welcome to {{ venues.map((venue) => venue.name).join(' & ') }}
        </div>
        <div class="text-2xl">
          Check out
          <a class="text-sta-orange" href="/">uobtheatre.com</a> for all of our
          upcoming productions
        </div>
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
import HaveTicketsReadyScreen from '@/components/publicity-screens/HaveTicketsReadyScreen.vue'
import SoldOutScreen from '@/components/publicity-screens/SoldOutScreen.vue'
import WelcomeScreen from '@/components/publicity-screens/WelcomeScreen.vue'
import PleaseWaitScreen from '@/components/publicity-screens/PleaseWaitScreen.vue'

export default {
  components: {
    QrcodeVue,
    IconListItem,
    HaveTicketsReadyScreen,
    SoldOutScreen,
  },
  layout: 'publicityScreen',
  data() {
    return {
      now: null,
      nowTimer: null,

      productions: [],
      venues: [],
      dataFetchTimer: null,

      currentProductionIndex: 0,
      slideTimer: null,

      onNowScreenIndex: 0,
      onNowProductionIndex: 0,
      paused: false,
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
        ? window.location.host +
            this.$router.resolve({
              path: `/production/${this.currentDisplayedProduction.slug}`,
            }).href
        : ''
    },
    productionsOnNow() {
      if (!this.now) return []
      return this.productions.filter((production) => {
        if (!production.performances.edges.length) {
          return false
        }
        const doorsOpenTime = DateTime.fromISO(
          production.performances.edges[0].node.doorsOpen
        )
        const startTime = DateTime.fromISO(
          production.performances.edges[0].node.start
        )
        return (
          production.performances.edges.length &&
          doorsOpenTime.minus({ minutes: 20 }) <= this.now &&
          startTime > this.now
        )
      })
    },
    currentScreen() {
      return this.productionsOnNow.length
        ? this.screensForPerformance(
            this.productionsOnNow[this.onNowProductionIndex].performances
              .edges[0].node
          )[this.onNowScreenIndex]
        : null
    },
  },
  watch: {
    productionsOnNow(newVal, oldVal) {
      if (newVal.length === 0 && oldVal.length !== 0) {
        this.fetchData()
      }
    },
  },
  mounted() {
    this.fetchData()

    this.nowTimer = setInterval(() => {
      this.now = DateTime.now()
    }, 5000)
    this.dataFetchTimer = setInterval(this.fetchData, 7200000)
    this.slideTimer = setInterval(() => {
      if (this.paused) return

      // General promotion
      if (
        this.currentProductionIndex + 1 >=
        this.marketableProductions.length
      ) {
        this.currentProductionIndex = 0
      } else {
        this.currentProductionIndex += 1
      }

      // Active productions
      const reset =
        !this.productionsOnNow.length ||
        this.onNowScreenIndex + 1 >=
          this.screensForPerformance(
            this.productionsOnNow[this.onNowProductionIndex].performances
              .edges[0].node
          ).length

      if (!this.productionsOnNow.length || reset) {
        this.onNowScreenIndex = 0
        if (
          reset &&
          this.onNowProductionIndex + 1 < this.productionsOnNow.length
        ) {
          this.onNowProductionIndex += 1
        } else {
          this.onNowProductionIndex = 0
        }
      } else {
        this.onNowScreenIndex += 1
      }
    }, 1000 * 10)
  },
  destroyed() {
    clearInterval(this.nowTimer)
    clearInterval(this.dataFetchTimer)
    clearInterval(this.slideTimer)
  },
  methods: {
    displayStartEnd,
    screensForPerformance(performance) {
      const screens = []
      if (this.now < DateTime.fromISO(performance.doorsOpen)) {
        screens.push(PleaseWaitScreen)
      } else if (this.now < DateTime.fromISO(performance.start)) {
        screens.push(WelcomeScreen, HaveTicketsReadyScreen)

        if (performance.soldOut) {
          screens.push(SoldOutScreen)
        }
      }

      return screens
    },
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
