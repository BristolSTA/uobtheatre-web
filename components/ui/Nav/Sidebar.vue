<template>
  <nav class="p-4 space-y-1 bg-sta-gray-dark dark:bg-cf-gray-darker md:block">
    <div class="flex justify-start mb-4 md:hidden">
      <font-awesome-icon icon="times" class="fa-2x" @click="$emit('close')" />
    </div>
    <slot></slot>
  </nav>
</template>
