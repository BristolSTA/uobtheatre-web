<template>
  <div
    class="flex flex-col p-3 text-white"
    :class="[performanceDisabled ? 'bg-sta-gray-dark' : 'bg-sta-green']"
  >
    <h2 class="text-h2">
      {{ performance.start | dateFormat('cccc d MMM') }}
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
      <template v-if="performance.isOnline">Online</template>
    </div>
    <div>Starting at {{ performance.start | dateFormat('T') }}</div>
    <div>{{ humanDuration }}</div>
    <div class="text-sm font-semibold">
      <p v-if="performanceDisabled">No Tickets Available</p>
      <p v-else>Tickets Available</p>
    </div>
    <div class="flex-grow"></div>
    <button
      v-if="performanceDisabled"
      class="w-2/3 mt-4 font-semibold text-center btn btn-rouge btn-outline disabled"
      disabled
    >
      {{ disabledReason }}
    </button>
    <button
      v-else
      class="w-2/3 mt-4 font-semibold text-center btn btn-orange"
      @click="onBook"
      @keypress="onBook"
    >
      <slot name="select-button">Book</slot>
    </button>
  </div>
</template>

<script>
import humanizeDuration from 'humanize-duration'
export default {
  props: {
    performance: {
      required: true,
      type: Object,
    },
  },
  computed: {
    humanDuration() {
      return humanizeDuration(this.performance.durationMins * 60 * 1000)
    },
    performanceDisabled() {
      return this.performance.disabled || this.performance.soldOut
    },
    disabledReason() {
      if (this.performance.soldOut) return 'SOLD OUT'
      return 'Unavailable'
    },
  },
  methods: {
    onBook() {
      this.$emit('select')
    },
  },
}
</script>
