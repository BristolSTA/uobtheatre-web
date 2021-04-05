<template functional>
  <div class="p-4 text-white rounded-lg shadow bg-sta-gray-light">
    <div class="flex flex-wrap">
      <h2 class="flex-grow mb-1 text-h3 sm:text-h2">
        <slot name="title"></slot>
      </h2>
      <div v-if="$slots.messageBox" class="pb-1 pr-1 sm:pr-4 sm:pb-0">
        <slot name="messageBox"></slot>
      </div>
    </div>
    <div v-if="$slots.subtitle" class="font-semibold text-sta-orange">
      <slot name="subtitle"></slot>
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OverviewBox',
}
</script>
