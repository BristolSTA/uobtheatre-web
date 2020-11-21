<template>
  <div
    class="flex flex-wrap items-center justify-center space-x-0 md:space-x-10 py-12"
  >
    <template v-if="!production">
      <div class="text-white text-xl justify-center font-semibold my-20">
        Loading Production...
      </div>
    </template>
    <template v-else>
      <div class="inline-block relative m-10 w-full md:w-2/3 max-w-xl">
        <img
          class="w-full p-8"
          :src="production.featured_image"
          :alt="`${production.name} feature image`"
        />
        <img
          :src="production.society.logo_image"
          :alt="`${production.society.name} logo`"
          class="absolute bottom-0 left-0 w-20"
        />
      </div>
      <div
        class="w-full flex flex-col text-white items-center px-10 md:block md:text-left md:w-auto md:max-w-md"
      >
        <span class="font-semibold text-center md:text-left">
          <span class="text-h2">{{ production.name }}</span>
          <p class="text-sta-gray-verylight mb-1 -mt-2">
            {{ production.subtitle }} by {{ production.society.name }}
          </p>
        </span>
        <p>Live at the {{ venues }}</p>
        <p>
          {{
            displayStartEnd(production.start_date, production.end_date, 'd MMM')
          }}
        </p>
        <icon-list-item icon="clock">{{ duration }}</icon-list-item>
        <icon-list-item icon="ticket-alt"
          >Tickets avaliable from
          <span class="font-semibold"
            >£{{ production.min_ticket_price }}</span
          ></icon-list-item
        >
        <button
          class="btn btn-green w-full font-semibold mt-4"
          @click="$emit('scroll-to-tickets')"
          @keydown="$emit('scroll-to-tickets')"
        >
          Buy Tickets
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import lo from 'lodash';
import { joinWithAnd, displayStartEnd } from '@/utils';
import IconListItem from '@/components/ui/IconListItem.vue';
import humanizeDuration from 'humanize-duration';

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
      if (!this.production || this.production.performances.length == 0) return;

      let venues = lo.uniq(
        this.production.performances.map((performance) => {
          return performance.venue.name;
        })
      );

      if (venues.length > 3) {
        venues = lo.take(venues, 2).append('others');
      }

      return joinWithAnd(venues);
    },
    duration() {
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
