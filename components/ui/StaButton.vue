<template>
  <component :is="asType" :to="to" class="rounded" :class="classes">
    <font-awesome-icon :icon="icon" class="mr-2" />
    <slot></slot
  ></component>
</template>

<script>
export default {
  props: {
    to: {
      default: null,
      type: String,
    },
    small: {
      default: false,
      type: Boolean,
    },
    icon: {
      default: null,
      type: String,
    },
    colour: {
      default: null,
      type: [String, Array],
    },
  },
  computed: {
    asType() {
      if (this.to) return 'nuxt-link'
      return 'button'
    },
    classes() {
      const arr = []
      arr.push(!this.small ? 'p-3' : 'p-1 text-sm')
      if (this.colour)
        arr.push(
          Array.isArray(this.colour)
            ? `bg-${this.colour[0]} hover:bg-${this.colour[1]}`
            : `bg-sta-${this.colour} hover:bg-sta-${this.colour}-dark`
        )
      return arr
    },
  },
}
</script>
