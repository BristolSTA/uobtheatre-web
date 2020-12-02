<template>
  <div class="flex items-center justify-center w-full h-full bg-sta-gray">
    <div class="w-full px-10 text-white sm:px-0 sm:w-1/2 xl:w-1/3">
      <div class="text-left">
        <slot>
          <h1 class="text-h1"><slot name="title">Oops!</slot></h1>
          <h2 class="text-h2">
            <slot name="subtitle">404 - Page Not found</slot>
          </h2>
        </slot>
      </div>
      <div class="mt-4" v-if="buttonTo">
        <router-link
          :to="buttonTo"
          class="font-semibold btn btn-outline btn-orange font"
          >{{ buttonText }}</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'error',
  props: {
    buttonText: {
      default: 'Return Home',
    },
    buttonTo: {
      default: '/',
    },
  },
};
</script>
