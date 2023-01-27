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
    modelValue: {
      type: String,
      default: null
    },
    mustSort: {
      type: Boolean,
      default: false
    },
    sortField: {
      type: String,
      default: null
    }
  },
  emits: ['update:modelValue'],
  computed: {
    currentlySorted() {
      return (
        this.modelValue &&
        (!this.sortField || this.modelValue.endsWith(this.sortField))
      );
    },
    currentlySortedUp() {
      return this.currentlySorted && this.modelValue.startsWith('-');
    },
    currentlySortedDown() {
      return this.currentlySorted && !this.currentlySortedUp;
    }
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
        if (this.modelValue.startsWith('-')) {
          this.$emit(
            'update:modelValue',
            this.mustSort ? '' + this.sortField : null
          );
        } else {
          this.$emit('update:modelValue', '-' + this.sortField);
        }
      } else {
        this.$emit('update:modelValue', '' + this.sortField);
      }
    }
  }
};
</script>
