<template>
  <div class="p-4 text-white bg-sta-gray-light rounded-lg shadow">
    <div class="flex flex-wrap items-center">
      <h2
        v-if="title || $slots.title"
        class="flex-grow mb-1 text-h3 sm:text-h2"
      >
        <slot name="title">
          {{ title }}
        </slot>
      </h2>
      <div v-if="$slots.messageBox" class="pb-1 pr-1 sm:pb-0 sm:pr-4">
        <slot name="messageBox" />
      </div>
    </div>
    <div v-if="$slots.subtitle" class="text-sta-orange font-semibold">
      <slot name="subtitle" />
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      default: null,
      type: String
    }
  }
}
</script>
