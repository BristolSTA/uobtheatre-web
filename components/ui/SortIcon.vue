<template>
  <span class="text-xl">
    <button class="pl-2 focus:outline-none" @click="onSort">
      <font-awesome-icon v-if="sortStatus == 1" icon="sort-up" />
      <font-awesome-icon v-else-if="sortStatus == 2" icon="sort-down" />
      <font-awesome-icon v-else icon="sort" />
    </button>
  </span>
</template>

<script>
export default {
  data() {
    return {
      sortStatus: 0,
    }
  },
  methods: {
    incrementSort() {
      if (this.sortStatus === 2) {
        this.sortStatus = 0
      } else {
        this.sortStatus += 1
      }
    },
    setSort(input) {
      this.sortStatus = input
    },
    onSort() {
      this.incrementSort()

      if (this.sortStatus === 1) {
        this.$emit('sort-up')
      } else if (this.sortStatus === 2) {
        this.$emit('sort-down')
      } else this.$emit('no-sort')
    },
  },
}
</script>
