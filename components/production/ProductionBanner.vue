<template>
  <div
    class="flex flex-wrap items-center justify-center space-x-0 md:space-x-10"
  >
    <div class="relative inline-block w-full max-w-xl m-8 md:w-2/3">
      <img
        ref="featured-image"
        class="w-full p-4 sm:p-8"
        :src="production.featuredImage.url"
        :alt="`${production.name} feature image`"
      />
      <img
        v-if="production.society.logo"
        ref="society-image"
        :src="production.society.logo.url"
        :alt="`${production.society.name} logo`"
        class="absolute bottom-0 left-0 w-10 sm:w-20"
      />
    </div>
    <div
      class="
        flex flex-col
        items-center
        w-full
        px-10
        text-center text-white
        md:block md:text-left md:w-auto md:max-w-md
      "
    >
      <span class="font-semibold">
        <span class="text-h2">{{ production.name }}</span>
        <p class="mb-1 -mt-2 text-sta-gray-lighter">
          by
          <NuxtLink
            class="hover:text-gray-500"
            :to="`/society/${production.society.slug}`"
          >
            {{ production.society.name }}
          </NuxtLink>
        </p>
      </span>
      <template
        v-if="showDetailedInfo && !!production.performances.edges.length"
      >
        <p>
          <template v-if="hasInPersonPerformances">
            Live at
            <span v-for="(venue, index) in venues" :key="index">
              <template v-if="index < venueOverflow">
                <template v-if="index > 0">and</template>
                <NuxtLink
                  v-if="venue.publiclyListed"
                  class="hover:text-gray-300"
                  :to="`/venue/${venue.slug}`"
                >
                  {{ venue.name }}
                </NuxtLink>
                <template v-else> {{ venue.name }} </template>
              </template>
              <template v-if="index == venueOverflow + 1"> and others</template>
            </span>
          </template>
          <template v-if="hasOnlinePerformances && hasInPersonPerformances">
            and Online
          </template>
          <template v-if="!hasInPersonPerformances">View Online</template>
        </p>
        <p>
          {{ displayStartEnd(production.start, production.end, 'd MMM') }}
        </p>
        <icon-list-item v-if="duration" icon="clock">
          {{ duration }}
        </icon-list-item>
        <icon-list-item v-if="production.minSeatPrice" icon="ticket-alt">
          Tickets available from
          <span class="font-semibold">
            £{{ (production.minSeatPrice / 100).toFixed(2) }}
          </span>
        </icon-list-item>
      </template>
      <button
        v-if="showBuyTicketsButton && production.isBookable"
        class="w-full mt-4 font-semibold btn btn-green"
        @click="$emit('on-buy-tickets-click')"
        @keypress="$emit('on-buy-tickets-click')"
      >
        Buy Tickets
      </button>
    </div>
  </div>
</template>

<script>
import humanizeDuration from 'humanize-duration'
import lo from 'lodash'

import IconListItem from '@/components/ui/IconListItem.vue'
import { displayStartEnd } from '@/utils'

export default {
  name: 'ProductionBanner',
  components: { IconListItem },
  props: {
    production: {
      required: true,
      type: Object,
    },
    showBuyTicketsButton: {
      default: true,
      type: Boolean,
    },
    showDetailedInfo: {
      default: true,
      type: Boolean,
    },
  },
  data() {
    return {
      venueOverflow: 3,
    }
  },
  computed: {
    venues() {
      let venues = []
      if (this.hasInPersonPerformances) {
        venues = lo.uniqBy(
          this.production.performances.edges.map((edge) => {
            return edge.node.venue
          }),
          'name'
        )
      }
      lo.take(venues, this.venueOverflow + 1)
      return venues
    },
    hasOnlinePerformances() {
      return !!this.production.performances.edges.find(
        (edge) => edge.node.isOnline
      )
    },
    hasInPersonPerformances() {
      return !!this.production.performances.edges.find(
        (edge) => edge.node.isInperson
      )
    },
    duration() {
      if (!this.production.performances.edges.length) return
      return humanizeDuration(
        lo
          .chain(this.production.performances.edges.map((edge) => edge.node))
          .minBy('durationMins')
          .value().durationMins *
          60 *
          1000
      )
    },
  },
  methods: {
    displayStartEnd,
  },
}
</script>
