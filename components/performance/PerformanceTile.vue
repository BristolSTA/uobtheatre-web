<template>
  <div
    class="flex flex-col p-3 text-white"
    :class="[performance.isBookable ? 'bg-sta-green' : 'bg-sta-gray-dark']"
  >
    <h2 class="text-h2">
      {{ dateFormat(performance.start, 'cccc d MMM') }}
    </h2>
    <div>
      <NuxtLink
        v-if="performance.isInperson"
        class="hover:text-gray-200"
        :to="`/venue/${performance.venue.slug}`"
      >
        {{ performance.venue.name }}
      </NuxtLink>
      <template v-if="performance.isOnline && performance.isInperson">
        and
      </template>
      <template v-if="performance.isOnline"> Online </template>
    </div>
    <div>Doors open at {{ dateFormat(performance.doorsOpen, 'T') }}</div>
    <div v-if="performance.durationMins">
      {{ humanDuration(performance.durationMins) }}
      <template v-if="performance.intervalDurationMins">
        inc. interval
      </template>
    </div>
    <button
      v-if="performance.isRelaxed"
      ref="categories"
      class="text-left"
      @click="showRelaxedCategoriesDetail = true"
    >
      <span class="hover:text-gray-200">{{ thisRelaxedName }} Performance</span>
    </button>
    <relaxed-categories-display
      v-if="showRelaxedCategoriesDetail"
      :relaxed-categories="
              performance.relaxedCategories"
      :this-relaxed-name="thisRelaxedName"
      @close="showRelaxedCategoriesDetail = false"
    />
    <div class="flex-grow" />
    <div class="text-sm font-semibold">
      <p v-if="!performance.isBookable">No Tickets Available</p>
      <p v-else>Tickets Available</p>
    </div>
    <button
      v-if="!performance.isBookable"
      class="btn btn-rouge btn-outline disabled mt-4 w-2/3 text-center font-semibold"
      disabled
    >
      {{ disabledReason }}
    </button>
    <component
      :is="actionPath ? 'NuxtLink' : 'button'"
      v-else
      class="btn btn-orange mt-4 w-2/3 text-center font-semibold"
      :to="actionPath"
      @click="onAction"
      @keypress="onAction"
    >
      <slot name="select-button"> Book </slot>
    </component>
  </div>
</template>

<script>
import { humanDuration, dateFormat } from '@/utils/datetime';
import Modal from '~/components/ui/Modal.vue';
import RelaxedCategoriesDisplay from '~/components/performance/relaxed-categories/RelaxedCategoriesDisplay.vue';

export default {
  name: 'PerformanceOverviewTile',
  components: {
    Modal,
    RelaxedCategoriesDisplay,
  },
  props: {
    performance: {
      required: true,
      type: Object
    },
    actionPath: {
      default: null,
      type: String
    }
  },
  emits: ['select'],
  data() {
    return {
      showRelaxedCategoriesDetail: false
    };
  },
  computed: {
    disabledReason() {
      if (this.performance.soldOut) {
        return 'SOLD OUT';
      }
      return 'Unavailable';
    },
    thisRelaxedName() {
      return this.performance.relaxedName ? this.performance.relaxedName : 'Relaxed';
    }
  },
  methods: {
    onAction() {
      this.$emit('select');
    },
    humanDuration,
    dateFormat
  }
};
</script>
