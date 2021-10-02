<template>
  <div class="flex items-center p-3 rounded-lg bg-sta-gray-dark">
    <p class="font-semibold">{{ value.name }}</p>
    <font-awesome-icon
      v-if="removable"
      class="ml-auto transition-colors cursor-pointer hover:text-sta-rouge"
      icon="trash"
      @click="$emit('remove')"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      required: true,
      type: Object,
    },
    removable: {
      default: false,
      type: Boolean,
    },
  },
}
</script>
