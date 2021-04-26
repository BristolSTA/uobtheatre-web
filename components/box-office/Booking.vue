<template>
  <div class="text-white">
    <div
      ref="header"
      class="flex py-2 pl-4 cursor-pointer hover:bg-opacity-80"
      :class="[
        expanded
          ? 'bg-sta-orange'
          : index % 2 == 0
          ? 'bg-sta-gray-light'
          : 'bg-sta-gray',
      ]"
      @click="$emit('select-booking')"
      @keypress="$emit('select-booking')"
    >
      <div class="flex flex-grow">
        <div>{{ booking.name }}</div>
        <div class="px-2 font-mono w-30">{{ booking.reference }}</div>
        <div class="text-right">
          £{{ (booking.priceBreakdown.totalPrice / 100).toFixed(2) }}
        </div>
      </div>
    </div>
    <div
      v-if="expanded"
      class="pb-2 bg-sta-gray"
      :class="[index % 2 == 0 ? 'bg-sta-gray-light' : 'bg-sta-gray']"
    >
      aaaaaaaaaaaa
    </div>
  </div>
</template>

<script>
export default {
  name: 'SeatLocation',
  components: {},
  props: {
    booking: {
      required: true,
      type: Object,
    },
    expanded: {
      required: true,
      type: Boolean,
    },
    index: {
      required: true,
      type: Number,
    },
  },
  data() {
    return {}
  },
  computed: {},
  methods: {},
}
</script>
