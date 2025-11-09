<template>
  <component
    :is="asType"
    :href="to"
    class="inline-block rounded-sm transition-colors"
    :class="classes"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <!-- A button can contain a font-awesome icon passed as a prop.
    If the button is only an icon (i.e. has no slot), the icon will be centred, otherwise offset. -->
    <font-awesome-icon
      v-if="icon"
      :icon="icon"
      :class="{ 'mr-2': $slots.default }"
    />
    <slot />
  </component>
</template>

<script>
export default {
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
  emits: ['click'],
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
      arr.push(
        Array.isArray(this.colour)
          ? `bg-${this.colour[0]}`
          : `bg-sta-${this.colour}`
      );
      if (this.disabled) {
        arr.push('cursor-not-allowed');
      } else if (this.colour) {
        arr.push(
          Array.isArray(this.colour)
            ? `hover:bg-${this.colour[1]}`
            : `hover:bg-sta-${this.colour}-dark`
        );
      }
      return arr;
    }
  }
};
</script>
