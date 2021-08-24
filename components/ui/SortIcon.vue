<template>
  <span class="text-xl">
    <button class="pl-2 focus:outline-none" @click="onSort">
      <font-awesome-icon v-if="sortStatus == '-'" icon="sort-up" />
      <font-awesome-icon v-else-if="sortStatus == ''" icon="sort-down" />
      <font-awesome-icon v-else icon="sort" />
    </button>
  </span>
</template>

<script>
export default {
  data() {
    return {
      sortStatus: null,
    }
  },
  methods: {
    incrementSort() {
      if (this.sortStatus === '-') {
        this.sortStatus = null
      } else if (this.sortStatus === null) {
        this.sortStatus = ''
      } else {
        this.sortStatus = '-'
      }
    },
    onSort() {
      this.incrementSort()

      this.$emit('input', this.sortStatus)
    },
  },
}
</script>
