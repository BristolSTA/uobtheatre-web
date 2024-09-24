<template>
  <div
    class="flex flex-wrap items-center justify-center space-x-0 md:space-x-10"
  >
    <div class="relative inline-block m-8 w-full max-w-xl md:w-2/3">
      <production-featured-image
        data-test="featured-image"
        class="p-4 w-full sm:p-8"
        :image-object="production.featuredImage"
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
      class="flex flex-col items-center px-10 w-full text-center text-white md:block md:w-auto md:max-w-md md:text-left"
    >
      <span class="font-semibold">
        <span class="text-h2">{{ production.name }}</span>
        <p class="-mt-2 mb-1 text-sta-gray-lighter">
          by
          <NuxtLink
            class="hover:text-gray-500 text-gray-400"
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
                  class="hover:text-gray-300 font-semibold"
                  :to="`/venue/${venue.slug}`"
                >
                  {{ venue.name }}
                </NuxtLink>
                <template v-else> {{ venue.name }} </template>
              </template>
              <template v-if="index == venueOverflow + 1"> and others</template>
            </span>
            <template v-if="hasOnlinePerformances"> and Online </template>
          </template>
          <template v-else> View Online </template>
        </p>
        <p>
          {{ displayStartEnd(production.start, production.end, 'd MMM') }}
        </p>
        <icon-list-item v-if="duration" icon="clock">
          {{ duration }}
          <template
            v-if="
              production.performances.edges
                .map((edge: any) => edge.node)
                .find((node: any) => node.intervalDurationMins)
            "
          >
            <small>(inc. interval)</small>
          </template>
        </icon-list-item>
        <icon-list-item v-if="production.isBookable" icon="ticket">
          <template v-if="production.minSeatPrice">
            Tickets from
            <span class="font-semibold">
              £{{ (production.minSeatPrice / 100).toFixed(2) }}
            </span>
            <UTooltip class="pl-1" :popper="{ arrow: true }">
              <template #text>
                <span>10% + £1 to cover fees and support student theatre.</span>
              </template>
              <small
                >(exc. fees)<font-awesome-icon icon="circle-info" class="ml-1"
              /></small>
            </UTooltip>
          </template>
          <template v-else> Free tickets </template>
        </icon-list-item>
      </template>
      <button
        v-if="showBuyTicketsButton && production.isBookable"
        class="btn btn-green mt-4 w-full font-semibold"
        @click="emit('on-buy-tickets-click')"
        @keypress="emit('on-buy-tickets-click')"
      >
        Buy Tickets
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import humanizeDuration from 'humanize-duration';
import lo from 'lodash';

import ProductionFeaturedImage from './ProductionFeaturedImage.vue';
import IconListItem from '~~/components/ui/UiIconListItem.vue';
import { displayStartEnd } from '@/utils/datetime';

const emit = defineEmits<{
  (event: 'on-buy-tickets-click'): void;
}>();

const props = defineProps({
  production: {
    required: true,
    type: Object
  },
  showBuyTicketsButton: {
    default: true,
    type: Boolean
  },
  showDetailedInfo: {
    default: true,
    type: Boolean
  }
});

const venueOverflow = 3;

const hasOnlinePerformances = computed(() => {
  return !!props.production.performances.edges.find(
    (edge: any) => edge.node.isOnline
  );
});

const hasInPersonPerformances = computed(() => {
  return !!props.production.performances.edges.find(
    (edge: any) => edge.node.isInperson
  );
});

const venues = computed(() => {
  let venueList: any[] = [];
  if (hasInPersonPerformances.value) {
    venueList = lo.uniqBy(
      props.production.performances.edges.map((edge: any) => {
        return edge.node.venue;
      }),
      'name'
    );
  }
  lo.take(venueList, venueOverflow + 1);
  return venueList;
});

const duration = computed(() => {
  if (!props.production.performances.edges.length) {
    return;
  }
  return humanizeDuration(
    lo
      .chain(props.production.performances.edges.map((edge: any) => edge.node))
      .minBy('durationMins')
      .value().durationMins *
      60 *
      1000
  );
});
</script>
