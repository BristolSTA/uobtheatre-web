<template>
  <div class="flex items-center justify-center w-full h-full bg-sta-gray">
    <div class="px-10 w-full text-white sm:px-0 sm:w-1/2 xl:w-1/3">
      <div class="text-left">
        <slot>
          <h1 class="text-h1">
            <slot name="title"> Oops! </slot>
          </h1>
          <h2 class="text-h2">
            <slot name="subtitle">
              {{ errorTypeMessage }}
            </slot>
          </h2>
          <p v-if="error.message">
            {{ error.message }}
          </p>
        </slot>
      </div>
      <div v-if="buttonTo" class="mt-4">
        <NuxtLink
          :to="buttonTo"
          class="btn btn-outline btn-orange font font-semibold"
          @click="emit('clearError')"
        >
          {{ buttonText }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { H3Error } from 'h3';

const props = withDefaults(
  defineProps<{
    buttonText?: string;
    buttonTo?: string;
    error: Error;
  }>(),
  {
    buttonText: 'Return Home',
    buttonTo: '/'
  }
);

const emit = defineEmits(['clearError']);

const errorTypeMessage = computed(() => {
  if (props.error instanceof H3Error) {
    // H3Error extends Error and so is sometimes thrown
    if (props.error.statusCode === 404) {
      return '404 - Page Not found';
    }
    if (props.error.statusCode === 401) {
      return '401 - Unauthorized';
    }
  }
  return 'There was an issue.';
});
</script>
