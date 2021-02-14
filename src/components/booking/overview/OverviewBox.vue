<template>
  <div class="p-4 text-white rounded-lg shadow bg-sta-gray-light">
    <div class="flex flex-wrap">
      <h2 class="flex-grow mb-1 text-h3 sm:text-h2">
        <slot name="title" />
      </h2>
      <div v-if="$slots.message_box" class="pb-1 pr-1 sm:pr-4 sm:pb-0">
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
