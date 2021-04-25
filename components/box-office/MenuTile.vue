<template>
  <NuxtLink :to="route">
    <div class="p-3">
      <div class="text-h2">
        <font-awesome-icon v-if="icon" :icon="icon" />
        <span class="pl-2"> {{ name }}</span>
      </div>
      <div v-if="$slots.description" class="pb-1 pr-1 sm:pr-4 sm:pb-0">
        <slot name="description"></slot>
      </div>
    </div>
  </NuxtLink>
</template>

<script>
export default {
  components: {},
  props: {
    name: {
      required: true,
      type: String,
    },
    route: {
      required: true,
      type: [Object, String],
    },
    icon: {
      default: null,
      type: String,
    },
  },
}
</script>
