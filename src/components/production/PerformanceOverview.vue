<template>
  <div
    class="p-3 text-white performance"
    :class="[performanceDisabled ? 'bg-sta-gray-dark' : 'bg-sta-green']"
  >
    <h2 class="text-h2">
      {{ performance.start | dateFormat('cccc d MMM') }}
    </h2>
    <div>{{ performanceVenue }}</div>
    <div>Starting at {{ performance.start | dateFormat('T') }}</div>
    <div>{{ humanDuration }}</div>
    <div v-if="!overview_info" class="text-sm font-semibold">
      <p v-if="performanceDisabled">No Tickets Available</p>
      <p v-else>Tickets Available</p>
    </div>
    <template v-if="!overview_info">
      <button
        class="w-2/3 mt-4 font-semibold text-center btn btn-rouge btn-outline disabled"
        disabled
        v-if="performanceDisabled"
      >
        {{ disabledReason }}
      </button>
      <button
        @click="onBook"
        @keypress="onBook"
        class="w-2/3 mt-4 font-semibold text-center btn btn-orange"
        v-else
      >
        <slot name="select-button">Book</slot>
      </button>
    </template>
  </div>
</template>

<script>
import humanizeDuration from 'humanize-duration';
export default {
  props: {
    performance: {
      required: true,
    },
    overview_info: {
      required: false,
    },
  },
  methods: {
    onBook() {
      this.$emit('select', this.performance);
    },
  },
  computed: {
    humanDuration() {
      return humanizeDuration(this.performance.duration_mins * 60 * 1000);
    },
    performanceDisabled() {
      return this.performance.disabled || this.performance.sold_out;
    },
    disabledReason() {
      if (this.performance.sold_out) return 'SOLD OUT';
      return 'Unavailable';
    },
    performanceVenue() {
      if (this.performance.is_inperson && this.performance.is_online)
        return this.performance.venue.name + ' and Online';
      if (this.performance.is_online) return 'Online';
      return this.performance.venue.name;
    },
  },
};
</script>
