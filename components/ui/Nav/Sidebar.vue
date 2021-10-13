<template>
  <nav class="dark:bg-cf-gray-darker p-4 bg-sta-gray-dark space-y-1 md:block">
    <div class="flex justify-start mb-4 md:hidden">
      <font-awesome-icon icon="times" class="fa-2x" @click="$emit('close')" />
    </div>
    <slot></slot>
  </nav>
</template>
