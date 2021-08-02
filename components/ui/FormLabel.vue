<template>
  <div>
    <label>
      <span class="text-xs font-semibold text-white"><slot></slot></span>
      <p v-if="$slots.helper" class="text-sm text-gray-400">
        <slot name="helper"></slot>
      </p>
    </label>
    <slot name="control"></slot>
  </div>
</template>
