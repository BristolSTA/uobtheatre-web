<template>
  <div
    class="flex flex-col p-3 text-white"
    :class="[performance.isBookable ? 'bg-sta-green' : 'bg-sta-gray-dark']"
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
    <div>Doors open at {{ performance.doorsOpen | dateFormat('T') }}</div>
    <div v-if="performance.durationMins">
      {{ humanDuration(performance.durationMins) }}
    </div>
    <div class="text-sm font-semibold">
      <p v-if="!performance.isBookable">No Tickets Available</p>
      <p v-else>Tickets Available</p>
    </div>
    <div class="flex-grow"></div>
    <button
      v-if="!performance.isBookable"
      class="
        btn btn-rouge btn-outline
        disabled
        mt-4
        w-2/3
        text-center
        font-semibold
      "
      disabled
    >
      {{ disabledReason }}
    </button>
    <component
      :is="actionPath ? 'nuxt-link' : 'button'"
      v-else
      class="btn btn-orange mt-4 w-2/3 text-center font-semibold"
      :to="actionPath"
      @click="onAction"
      @keypress="onAction"
    >
      <slot name="select-button">Book</slot>
    </component>
  </div>
</template>

<script>
import { humanDuration } from '@/utils'

export default {
  props: {
    performance: {
      required: true,
      type: Object,
    },
    actionPath: {
      default: null,
      type: String,
    },
  },
  computed: {
    disabledReason() {
      if (this.performance.soldOut) return 'SOLD OUT'
      return 'Unavailable'
    },
  },
  methods: {
    onAction() {
      this.$emit('select')
    },
    humanDuration,
  },
}
</script>
