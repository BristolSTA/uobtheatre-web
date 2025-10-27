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
    <div class="text-sm font-semibold mt-2">
      <p v-if="!performance.isBookable">No Tickets Available</p>
      <p v-else>Tickets Available</p>
    </div>
    <button
      v-if="!performance.isBookable"
      class="btn btn-rouge btn-outline disabled mt-4 text-center font-semibold"
      disabled
    >
      {{ disabledReason }}
    </button>
    <component
      :is="actionPath ? 'NuxtLink' : 'button'"
      v-else
      class="btn btn-orange mt-4 text-center font-semibold"
      :to="actionPath"
      @click="onAction"
      @keypress="onAction"
    >
      <slot name="select-button">Book</slot>
    </component>
    <div
      v-if="performance.isRelaxed"
      class="-mx-3 -mb-3 mt-3 bg-sta-green-dark"
    >
      <button
        ref="categories"
        class="text-center font-semibold w-full text-gray-50 hover:text-gray-200 p-3 cursor-pointer"
        @click="showRelaxedCategoriesDetail = true"
      >
        <span class="">This is a {{ thisRelaxedName }} Performance</span>
        <span class="inline-block mr-3">More information</span>
        <font-awesome-icon icon="chevron-right" class="inline-block" />
      </button>
      <relaxed-categories-display
        v-if="showRelaxedCategoriesDetail"
        :relaxed-categories="performance.relaxedCategories"
        :this-relaxed-name="thisRelaxedName"
        @close="showRelaxedCategoriesDetail = false"
      />
    </div>
    <div v-else class="bg-sta-gray mt-3 -mx-3 -mb-3 flex-grow"></div>
  </div>
</template>

<script>
import { humanDuration, dateFormat } from '@/utils/datetime';
import Modal from '~/components/ui/Modal.vue';
import RelaxedCategoriesDisplay from '~/components/performance/relaxed-categories/RelaxedCategoriesDisplay.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
  name: 'PerformanceOverviewTile',
  components: {
    FontAwesomeIcon,
    Modal,
    RelaxedCategoriesDisplay
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
      return this.performance.relaxedName
        ? this.performance.relaxedName
        : 'Relaxed';
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
