<template>
  <div
    class="flex flex-wrap items-center justify-center space-x-0 md:space-x-10"
  >
    <div class="relative inline-block w-full max-w-xl m-10 md:w-2/3">
      <img
        class="w-full p-8"
        :src="production.featured_image"
        :alt="`${production.name} feature image`"
        ref="featured_image"
      />
      <img
        :src="production.society.logo_image"
        :alt="`${production.society.name} logo`"
        class="absolute bottom-0 left-0 w-20"
        v-if="production.society.logo_image"
        ref="society_image"
      />
    </div>
    <div
      class="flex flex-col items-center w-full px-10 text-white md:block md:text-left md:w-auto md:max-w-md"
    >
      <span class="font-semibold text-center md:text-left">
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
        {{
          displayStartEnd(production.start_date, production.end_date, 'd MMM')
        }}
      </p>
      <icon-list-item v-if="duration" icon="clock">
        {{ duration }}
      </icon-list-item>
      <icon-list-item icon="ticket-alt" v-if="production.min_ticket_price">
        Tickets available from
        <span class="font-semibold"> £{{ production.min_ticket_price }} </span>
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
    venues() {
      if (!this.production.performances.length) return '';

      let venues = [];
      if (this.hasInPersonPerformances) {
        venues = lo.uniq(
          this.production.performances.map((performance) => {
            return performance.venue.name;
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
      return !!this.production.performances.find(
        (performance) => performance.is_online
      );
    },
    hasInPersonPerformances() {
      return !!this.production.performances.find(
        (performance) => performance.is_inperson
      );
    },
    duration() {
      if (!this.production.performances.length) return;
      return humanizeDuration(
        lo.chain(this.production.performances).minBy('duration_mins').value()
          .duration_mins *
          60 *
          1000
      );
    },
  },
};
</script>
