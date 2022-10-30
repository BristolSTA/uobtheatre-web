<template>
  <component
    :is="asType"
    :href="to"
    class="inline-block rounded transition-colors"
    :class="classes"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <font-awesome-icon v-if="icon" :icon="icon" class="mr-2" />
    <slot />
  </component>
</template>

<script>
export default defineNuxtComponent({
  props: {
    to: {
      default: null,
      type: String
    },
    small: {
      default: false,
      type: Boolean
    },
    icon: {
      default: null,
      type: String
    },
    colour: {
      default: null,
      type: [String, Array]
    },
    disabled: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    asType() {
      if (this.to) {
        return resolveComponent('NuxtLink');
      }
      return 'button';
    },
    classes() {
      const arr = [];
      arr.push(!this.small ? 'p-2' : 'p-1 text-sm');
      if (this.disabled) {
        arr.push('cursor-not-allowed bg-gray-600');
      } else if (this.colour) {
        arr.push(
          Array.isArray(this.colour)
            ? `bg-${this.colour[0]} hover:bg-${this.colour[1]}`
            : `bg-sta-${this.colour} hover:bg-sta-${this.colour}-dark`
        );
      }
      return arr;
    }
  }
});
</script>
