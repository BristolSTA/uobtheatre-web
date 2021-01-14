<template>
  <div class="p-4 text-white rounded-lg shadow bg-sta-gray-light">
    <div class="flex">
      <h2 class="mb-1 text-h3 sm:text-h2">
        <slot name="title" />
      </h2>
      <div v-if="$slots.message_box" class="flex-grow px-4">
        <slot name="message_box" />
      </div>
    </div>
    <div v-if="$slots.subtitle" class="font-semibold text-sta-orange">
      <slot name="subtitle" />
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'overview-box',
};
</script>
