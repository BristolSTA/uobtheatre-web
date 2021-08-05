<template>
  <NuxtLink
    class="
      flex
      items-start
      p-2
      bg-transparent
      rounded-lg
      row
      hover:text-gray-900
      focus:text-gray-900
      hover:bg-gray-200
      focus:bg-gray-200 focus:outline-none focus:shadow-outline
    "
    :to="route"
  >
    <div
      v-if="icon"
      class="
        flex
        items-center
        justify-center
        w-12
        h-12
        text-white
        rounded-lg
        bg-sta-green
      "
    >
      <font-awesome-icon :icon="icon" class="w-1/2" />
    </div>
    <div :class="{ 'ml-3': icon }">
      <p class="font-semibold">{{ title }}</p>
      <p v-if="subtitle" class="text-sm">{{ subtitle }}</p>
    </div>
  </NuxtLink>
</template>

<script>
export default {
  props: {
    title: {
      required: true,
      type: String,
    },
    subtitle: {
      default: null,
      type: String,
    },
    icon: {
      default: null,
      type: String,
    },
    route: {
      required: true,
      type: [Object, String],
    },
  },
}
</script>
