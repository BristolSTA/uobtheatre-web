<template>
  <component
    :is="to ? 'NuxtLink' : 'div'"
    class="p-3 cursor-pointer"
    :to="to"
    @click="go"
  >
    <div :class="textSize">
      <font-awesome-icon v-if="icon" :icon="icon" />
      <span class="pl-2"><slot /></span>
    </div>
    <div v-if="$slots.description" class="pb-1 pr-1 sm:pb-0 sm:pr-4">
      <slot name="description" />
    </div>
  </component>
</template>

<script>
export default {
  props: {
    to: {
      default: null,
      type: [Object, String]
    },
    icon: {
      default: null,
      type: String
    },
    textSize: {
      default: 'text-h2',
      type: String
    }
  },
  emits: ['close', 'click'],
  methods: {
    go() {
      if (this.to) {
        useRouter().push(this.to);
      } else {
        this.$emit('click');
      }
    }
  }
};
</script>
