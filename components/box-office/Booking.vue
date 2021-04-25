<template>
  <div class="text-white">
    <div
      ref="header"
      class="flex py-2 pl-4 cursor-pointer hover:bg-opacity-80"
      :class="[
        expanded
          ? 'bg-sta-orange'
          : index % 2 == 0
          ? 'bg-sta-gray'
          : 'bg-sta-gray-light',
      ]"
      @click="$emit('select-booking')"
      @keypress="$emit('select-booking')"
    >
      <div class="flex-grow">
        <h3 class="inline-block text-h3 lg:text-h2">Booking</h3>
      </div>
    </div>
    <div
      v-if="expanded"
      class="pb-2 bg-sta-gray"
      :class="[index % 2 == 0 ? 'bg-sta-gray' : 'bg-sta-gray-light']"
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
