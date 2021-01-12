<template>
  <div class="p-4 text-white rounded-lg shadow bg-sta-gray-light">
    <div class="flex">
      <h2
        class="mb-1 text-h3 sm:text-h2"
        :class="msgbox ? 'w-1/3 lg:w-1/2' : 'w-full'"
      >
        <slot name="title" />
      </h2>
      <div v-if="msgbox" class="w-2/3 lg:w-1/2">
        <slot name="msgbox" />
      </div>
    </div>
    <div v-if="subtitle" class="font-semibold text-sta-orange">
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
  props: {
    subtitle: {
      default: true,
    },
    msgbox: {
      default: false,
    },
  },
};
</script>
