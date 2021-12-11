<template>
  <div class="flex items-center p-3 bg-sta-gray-dark rounded-lg">
    <p class="font-semibold">
      {{ value.name }}<br /><small>Max Capacity: {{ value.capacity }}</small>
    </p>
    <font-awesome-icon
      v-if="removable"
      class="ml-auto hover:text-sta-rouge cursor-pointer transition-colors"
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
