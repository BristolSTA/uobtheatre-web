<template>
  <div
    class="flex flex-wrap items-center justify-center py-12 space-x-0 md:space-x-10"
  >
    <div class="relative inline-block w-full max-w-xl m-10 md:w-2/3">
      <img
        class="w-full p-8"
        :src="production.featuredImage.url"
        :alt="`${production.name} feature image`"
        ref="featured_image"
      />
      <img
        :src="production.society.logo.url"
        :alt="`${production.society.name} logo`"
        class="absolute bottom-0 left-0 w-20"
        v-if="production.society.logo"
        ref="society_image"
      />
    </div>
    <div
      class="flex flex-col items-center w-full px-10 text-white md:block md:text-left md:w-auto md:max-w-md"
    >
      <span class="font-semibold text-center md:text-left">
        <span class="text-h2">{{ production.name }}</span>
        <p class="mb-1 -mt-2 text-sta-gray-lighter">
          {{ production.subtitle }} by
          <router-link
            :to="{
              name: 'society',
              params: { societySlug: production.society.slug },
            }"
          >
            {{ production.society.name }}
          </router-link>
        </p>
      </span>
      <p>
        <template v-if="hasInPersonPerformances">Live at the</template>
        <template v-else>View </template>
        {{ venues }}
      </p>
      <p>
        {{ displayStartEnd(production.start, production.end, 'd MMM') }}
      </p>
      <icon-list-item v-if="duration" icon="clock">
        {{ duration }}
      </icon-list-item>
      <icon-list-item icon="ticket-alt" v-if="production.minSeatPrice">
        Tickets available from
        <span class="font-semibold">
          £{{ (production.minSeatPrice / 100).toFixed(2) }}
        </span>
      </icon-list-item>
      <button
        class="w-full mt-4 font-semibold btn btn-green"
        @click="$emit('scroll-to-tickets')"
        @keydown="$emit('scroll-to-tickets')"
      >
        Buy Tickets
      </button>
    </div>
  </div>
</template>

<script>
import humanizeDuration from 'humanize-duration';
import lo from 'lodash';

import IconListItem from '@/components/ui/IconListItem.vue';
import { displayStartEnd, joinWithAnd } from '@/utils';

export default {
  components: { IconListItem },
  name: 'ProductionHeader',
  props: {
    production: {
      required: true,
    },
  },
  methods: {
    displayStartEnd,
  },
  computed: {
    venues() {
      if (!this.production.performances.edges.length) return '';

      let venues = [];
      if (this.hasInPersonPerformances) {
        venues = lo.uniq(
          this.production.performances.edges.map((edge) => {
            return edge.node.venue.name;
          })
        );

        if (venues.length > 3) {
          venues = lo.take(venues, 2);
          venues.push('others');
        }
      }

      if (this.hasOnlinePerformances) {
        venues = lo.take(venues);
        venues.push('Online');
      }
      return joinWithAnd(venues);
    },
    hasOnlinePerformances() {
      return !!this.production.performances.edges.find(
        (edge) => edge.node.isOnline
      );
    },
    hasInPersonPerformances() {
      return !!this.production.performances.edges.find(
        (edge) => edge.node.isInperson
      );
    },
    duration() {
      if (!this.production.performances.edges.length) return;
      return humanizeDuration(
        lo
          .chain(this.production.performances.edges.map((edge) => edge.node))
          .minBy('durationMins')
          .value().durationMins *
          60 *
          1000
      );
    },
  },
};
</script>
