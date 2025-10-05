<template>
  <div class="mb-2">
    <div
      ref="clickable"
      class="w-full py-1 px-3 transition-colors group hover:bg-gray-600 rounded"
      :class="{
        'rounded-bl-none rounded-br-none bg-gray-600': expanded,
        'bg-gray-700': !expanded
      }"
      @click="expanded = !expanded"
    >
      <div class="flex justify-between items-center text-left">
        <h3 class="font-bold">{{ contentWarning.shortDescription }}</h3>
        <div class="flex justify-center items-center">
          <span class="font-medium ml-2"
            >show {{ expanded ? 'less' : 'more' }}</span
          >
          <font-awesome-icon
            icon="chevron-down"
            class="ml-2 transition-transform duration-200"
            :class="{ 'rotate-180': expanded }"
          />
        </div>
      </div>
    </div>
    <div
      v-if="expanded"
      ref="description"
      class="p-3 bg-gray-700 overflow-x-auto rounded-bl rounded-br"
    >
      {{ description }}
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

export default {
  components: { FontAwesomeIcon },
  props: {
    contentWarning: {
      required: true,
      type: Object
    },
    open: {
      default: false,
      type: Boolean
    }
  },
  emits: ['update:open'],
  data() {
    return {
      expanded: this.open
    };
  },
  computed: {
    description() {
      return this.contentWarning.longDescription
        ? this.contentWarning.longDescription
        : this.contentWarning.shortDescription;
    }
  },
  watch: {
    open(newVal) {
      this.expanded = newVal;
    },
    expanded(newVal) {
      this.$emit('update:open', newVal);
    }
  }
};
</script>
