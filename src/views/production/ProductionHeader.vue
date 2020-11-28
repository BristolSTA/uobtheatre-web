<template>
  <div
    class="flex flex-wrap items-center justify-center py-12 space-x-0 md:space-x-10"
  >
    <div class="relative inline-block w-full max-w-xl m-10 md:w-2/3">
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
      class="flex flex-col items-center w-full px-10 text-white md:block md:text-left md:w-auto md:max-w-md"
    >
      <span class="font-semibold text-center md:text-left">
        <span class="text-h2">{{ production.name }}</span>
        <p class="mb-1 -mt-2 text-sta-gray-verylight">
          {{ production.subtitle }} by {{ production.society.name }}
        </p>
      </span>
      <p>
        <template v-if="hasInPersonPerformances">Live at the</template>
        <template v-else>View </template>
        {{ venues }}
      </p>
      <p>
        {{
          displayStartEnd(production.start_date, production.end_date, 'd MMM')
        }}
      </p>
      <icon-list-item v-if="duration" icon="clock">{{
        duration
      }}</icon-list-item>
      <icon-list-item icon="ticket-alt"
        >Tickets avaliable from
        <span class="font-semibold"
          >£{{ production.min_ticket_price }}</span
        ></icon-list-item
      >
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
      if (this.hasInPersonPerformances) {
        if (!this.production || !this.production.performances.length) return;
        let venues = lo.uniq(
          this.production.performances.map((performance) => {
            return performance.venue.name;
          })
        );

        if (venues.length > 3) {
          venues = lo.take(venues, 2);
          venues.push('others');
        }

        if (this.hasOnlinePerformances) {
          venues = lo.take(venues);
          venues.push('Online');
        }

        return joinWithAnd(venues);
      }
      return 'Online';
    },
    hasOnlinePerformances() {
      if (!this.production.performances) return;
      return !!this.production.performances.find(
        (performance) => performance.is_online
      );
    },
    hasInPersonPerformances() {
      if (!this.production.performances) return;
      return !!this.production.performances.find(
        (performance) => performance.is_inperson
      );
    },
    duration() {
      if (!this.production || !this.production.performances.length) return;
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
