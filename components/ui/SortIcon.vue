<template>
  <span class="text-xl">
    <button class="pl-2 focus:outline-none" @click="onSort">
      <font-awesome-icon v-if="currentlySortedUp" icon="sort-up" />
      <font-awesome-icon v-else-if="currentlySortedDown" icon="sort-down" />
      <font-awesome-icon v-else icon="sort" />
    </button>
  </span>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: null,
    },
    mustSort: {
      type: Boolean,
      default: false,
    },
    sortField: {
      type: String,
      default: null,
    },
  },
  computed: {
    currentlySorted() {
      return (
        this.value && (!this.sortField || this.value.endsWith(this.sortField))
      );
    },
    currentlySortedUp() {
      return this.currentlySorted && this.value.startsWith('-');
    },
    currentlySortedDown() {
      return this.currentlySorted && !this.currentlySortedUp;
    },
  },
  mounted() {
    if (this.mustSort && !this.currentlySorted) {
      this.onSort();
    }
  },
  methods: {
    onSort() {
      // If we have a sort field, check if the current sort is targeting it.
      // If it doesn't we wi

      if (this.currentlySorted) {
        // Exisiting sort
        if (this.value.startsWith('-')) {
          this.$emit('input', this.mustSort ? '' + this.sortField : null);
        } else {
          this.$emit('input', '-' + this.sortField);
        }
      } else {
        this.$emit('input', '' + this.sortField);
      }

      // if (this.value === '-') {
      //   this.$emit('input', this.mustSort ? this.sortField ?? '' : null)
      // } else if (this.value === null) {
      //   this.$emit('input', '')
      // } else {
      //   this.$emit('input', '-')
      // }
    },
  },
};
</script>
