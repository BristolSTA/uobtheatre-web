<template>
  <component
    :is="to ? 'nuxt-link' : 'div'"
    class="p-3 cursor-pointer"
    :to="to"
    @click="go"
  >
    <div class="text-h2">
      <font-awesome-icon v-if="icon" :icon="icon" />
      <span class="pl-2"><slot></slot></span>
    </div>
    <div v-if="$slots.description" class="pb-1 pr-1 sm:pb-0 sm:pr-4">
      <slot name="description"></slot>
    </div>
  </component>
</template>

<script>
export default {
  props: {
    to: {
      default: null,
      type: [Object, String],
    },
    icon: {
      default: null,
      type: String,
    },
  },
  methods: {
    go() {
      if (this.to) this.$router.push(this.to)
      else this.$emit('click')
    },
  },
}
</script>
