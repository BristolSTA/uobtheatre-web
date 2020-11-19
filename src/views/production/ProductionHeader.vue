<template>
  <div
    class="flex flex-wrap items-center justify-center space-x-0 md:space-x-10 py-12"
  >
    <div class="inline-block relative m-r-8 m-10 w-full md:w-2/3 max-w-xl">
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
      class="w-full flex flex-col text-white items-center md:block md:text-left md:w-auto md:max-w-md"
    >
      <span class="font-semibold text-center md:text-left">
        <span class="text-h2">{{ production.name }}</span>
        <p class="text-sta-gray-verylight mb-1 -mt-2">
          {{ production.subtitle }} by {{ production.society.name }}
        </p>
      </span>
      <p>Live at the {{ venues }}</p>
      <p>
        {{ production.start_date | dateFormat('d MMM') }} -
        {{ production.end_date | dateFormat('d MMM y') }}
      </p>
      <div class="flex">
        <div class="w-6 text-center mr-1">
          <font-awesome-icon icon="clock" />
        </div>
        <div class="">{{ duration }}</div>
      </div>
      <div class="flex">
        <div class="w-6 text-center mr-1">
          <font-awesome-icon icon="ticket-alt" />
        </div>
        <div>
          Tickets avaliable from
          <span class="font-semibold">£{{ production.min_ticket_price }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import lo from 'lodash';
import { joinWithAnd } from '@/utils';

export default {
  name: 'ProductionHeader',
  props: {
    production: {
      required: true,
    },
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
      return lo
        .chain(this.production.performances)
        .minBy('duration_mins')
        .value().duration_human;
    },
  },
};
</script>
