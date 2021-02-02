<template>
  <div
    class="flex flex-wrap items-center justify-center space-x-0 md:space-x-10"
  >
    <div class="relative inline-block w-full max-w-xl m-8 md:w-2/3">
      <img
        class="w-full p-4 sm:p-8"
        :src="production.featuredImage.url"
        :alt="`${production.name} feature image`"
        ref="featured_image"
      />
      <img
        :src="production.society.logoImage.url"
        :alt="`${production.society.name} logo`"
        class="absolute bottom-0 left-0 w-10 sm:w-20"
        v-if="production.society.logoImage"
        ref="society_image"
      />
    </div>
    <div
      class="flex flex-col items-center w-full px-10 text-center text-white md:block md:text-left md:w-auto md:max-w-md"
    >
      <span class="font-semibold">
        <span class="text-h2">{{ production.name }}</span>
        <p class="mb-1 -mt-2 text-sta-gray-lighter">
          {{ production.subtitle }} by {{ production.society.name }}
        </p>
      </span>
      <p>
        <template v-if="hasInPersonPerformances">Live at the</template>
        <template v-else>Watch </template>
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
        <span class="font-semibold"> £{{ production.minSeatPrice }} </span>
      </icon-list-item>
      <button
        v-if="showBuyTicketsButton"
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
import humanizeDuration from 'humanize-duration';
import lo from 'lodash';

import IconListItem from '@/components/ui/IconListItem.vue';
import { displayStartEnd, joinWithAnd } from '@/utils';

export default {
  components: { IconListItem },
  name: 'ProductionBanner',
  props: {
    production: {
      required: true,
    },
    showBuyTicketsButton: {
      default: true,
    },
  },
  methods: {
    displayStartEnd,
  },
  computed: {
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
  },
};
</script>
