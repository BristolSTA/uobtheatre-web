<template>
  <NuxtLink
    class="row focus:shadow-outline flex items-start p-2 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 bg-transparent rounded-lg focus:outline-none"
    :to="route"
    @click.native="$emit('click')"
  >
    <div
      v-if="icon"
      class="flex items-center justify-center w-12 h-12 text-white bg-sta-green rounded-lg"
    >
      <font-awesome-icon :icon="icon" class="w-1/2" />
    </div>
    <div :class="{ 'ml-3': icon }">
      <p class="font-semibold">
        {{ title }}
      </p>
      <p v-if="subtitle" class="text-sm">
        {{ subtitle }}
      </p>
    </div>
  </NuxtLink>
</template>

<script>
export default {
  props: {
    title: {
      required: true,
      type: String
    },
    subtitle: {
      default: null,
      type: String
    },
    icon: {
      default: null,
      type: String
    },
    route: {
      required: true,
      type: [Object, String]
    }
  }
};
</script>
