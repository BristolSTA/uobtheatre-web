<template>
  <div class="h-full">
    <!-- If productions are active right now -->
    <template v-if="productionsOnNow.length">
      <component
        :is="currentScreen"
        ref="activeBoxOfficeComponent"
        :production="productionsOnNow[onNowProductionIndex]"
        :performance="
          productionsOnNow[onNowProductionIndex].performances.edges[0].node
        "
      />
    </template>

    <!-- If upcoming productions -->
    <div
      v-else-if="marketableProductions.length"
      class="flex flex-col p-4 gap-2 h-full overflow-hidden"
    >
      <div class="flex h-2/3 gap-4 justify-evenly">
        <div class="flex items-center justify-center">
          <production-featured-image
            :image-object="currentDisplayedProduction.featuredImage"
            class="w-auto max-h-full"
          />
        </div>
        <div class="flex flex-col items-center justify-evenly text-rsm">
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
            }}
          </icon-list-item>
          <icon-list-item icon="map-marker">
            {{
              currentDisplayedProduction.venues
                .map((venue) => venue.name)
                .join(', ')
            }}
          </icon-list-item>
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

    <!-- If no productions to shown -->
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
import { DateTime } from 'luxon';
import QrcodeVue from 'qrcode.vue';
import VenueUpcomingProductionsQuery from '@/graphql/queries/publicity-screen/VenueUpcomingProductions.gql';
import UpcomingProductionsQuery from '@/graphql/queries/publicity-screen/AllUpcomingProductions.gql';
import { displayStartEnd } from '~~/utils/datetime';
import IconListItem from '@/components/ui/IconListItem.vue';
import HaveTicketsReadyScreen from '@/components/publicity-screens/HaveTicketsReadyScreen.vue';
import SoldOutScreen from '@/components/publicity-screens/SoldOutScreen.vue';
import WelcomeScreen from '@/components/publicity-screens/WelcomeScreen.vue';
import PleaseWaitScreen from '@/components/publicity-screens/PleaseWaitScreen.vue';
import ProductionFeaturedImage from '@/components/production/ProductionFeaturedImage.vue';

import { defineNuxtComponent } from '#app';

export default defineNuxtComponent({
  components: {
    QrcodeVue,
    IconListItem,
    HaveTicketsReadyScreen,
    SoldOutScreen,
    ProductionFeaturedImage
  },
  layout: 'publicityScreen',
  data() {
    return {
      now: null,
      pageOpenTime: DateTime.now(),

      productions: [],
      venues: [],
      dataFetchTimer: null,

      currentProductionIndex: 0,
      slideTimer: null,

      onNowScreenIndex: 0,
      onNowProductionIndex: 0,
      paused: false
    };
  },
  computed: {
    marketableProductions() {
      return this.productions.filter((production) => production.isBookable);
    },
    currentDisplayedProduction() {
      return this.marketableProductions
        ? this.marketableProductions[this.currentProductionIndex]
        : null;
    },
    currentDisplayedProductionUrl() {
      return this.currentDisplayedProduction
        ? window.location.host +
            this.$router.resolve({
              path: `/production/${this.currentDisplayedProduction.slug}`
            }).href
        : '';
    },
    productionsOnNow() {
      if (!this.now) {
        return [];
      }
      return this.productions.filter((production) => {
        if (!production?.performances?.edges?.length) {
          return false;
        }
        const doorsOpenTime = DateTime.fromISO(
          production.performances.edges[0].node.doorsOpen
        );
        const startTime = DateTime.fromISO(
          production.performances.edges[0].node.start
        );
        return (
          production.performances.edges.length &&
          doorsOpenTime.minus({ minutes: 20 }) <= this.now &&
          startTime > this.now
        );
      });
    },
    currentScreen() {
      return this.productionsOnNow.length
        ? this.screensForPerformance(
            this.productionsOnNow[this.onNowProductionIndex].performances
              .edges[0].node
          )[this.onNowScreenIndex]
        : null;
    }
  },
  watch: {
    productionsOnNow(newVal, oldVal) {
      if (newVal.length === 0 && oldVal.length !== 0) {
        this.fetchData();
      }
    }
  },
  mounted() {
    this.fetchData();

    this.dataFetchTimer = setInterval(this.fetchData, 2 * 60 * 60 * 1000); // Every 2 hours

    this.slideTimer = setInterval(() => {
      this.now = DateTime.now();
      this.refreshPageIfRequired();

      if (this.paused) {
        return;
      }

      // General promotion
      if (
        this.currentProductionIndex + 1 >=
        this.marketableProductions.length
      ) {
        this.currentProductionIndex = 0;
      } else {
        this.currentProductionIndex += 1;
      }

      // Active productions
      const reset =
        !this.productionsOnNow.length ||
        this.onNowScreenIndex + 1 >=
          this.screensForPerformance(
            this.productionsOnNow[this.onNowProductionIndex].performances
              .edges[0].node
          ).length;

      if (!this.productionsOnNow.length || reset) {
        this.onNowScreenIndex = 0;
        if (
          reset &&
          this.onNowProductionIndex + 1 < this.productionsOnNow.length
        ) {
          this.onNowProductionIndex += 1;
        } else {
          this.onNowProductionIndex = 0;
        }
      } else {
        this.onNowScreenIndex += 1;
      }
    }, 1000 * 10);
  },
  unmounted() {
    clearInterval(this.dataFetchTimer);
    clearInterval(this.slideTimer);
  },
  methods: {
    displayStartEnd,
    screensForPerformance(performance) {
      const screens = [];
      if (this.now < DateTime.fromISO(performance.doorsOpen)) {
        screens.push(PleaseWaitScreen);
      } else if (this.now < DateTime.fromISO(performance.start)) {
        screens.push(WelcomeScreen, HaveTicketsReadyScreen);

        if (performance.soldOut) {
          screens.push(SoldOutScreen);
        }
      }

      return screens;
    },
    async fetchData() {
      const slugs = this.$route.params.venueSlugs.split(',');
      const showAllUpcoming =
        this.$route.query.onlyTheseVenues === undefined
          ? true
          : !this.$route.query.onlyTheseVenues;
      const queries = [];

      for (const slug of slugs) {
        queries.push(
          this.$apollo.query({
            query: VenueUpcomingProductionsQuery,
            variables: {
              slug,
              now: new Date(),
              nowDate: DateTime.now().toISODate()
            },
            fetchPolicy: 'no-cache'
          })
        );
      }

      const queryData = await Promise.all(queries);
      this.productions = [];
      this.venues = [];
      this.currentProductionIndex = 0;
      queryData.forEach((queryResult) => {
        if (queryResult.data.venue) {
          this.venues.push(queryResult.data.venue);
          this.productions.push(
            ...queryResult.data.venue.productions.edges.map((edge) => edge.node)
          );
        }
      });

      if (showAllUpcoming) {
        const { data } = await this.$apollo.query({
          query: UpcomingProductionsQuery,
          variables: { now: new Date() }
        });
        data.productions.edges.forEach((edge) => {
          if (
            this.productions
              .map((production) => production.id)
              .includes(edge.node.id)
          ) {
            return;
          }
          this.productions.push(edge.node);
        });
      }
    },
    refreshPageIfRequired() {
      // Every 12 hours, do a full refresh of the page to load new code
      if (this.now - this.pageOpenTime > 12 * 60 * 60 && this.now.hour === 0) {
        window.location.reload();
      }
    }
  }
});
</script>
