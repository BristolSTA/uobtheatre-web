<template>
  <div class="flex items-center justify-center w-full h-full bg-sta-gray">
    <div class="w-full px-10 text-white sm:px-0 sm:w-1/2 xl:w-1/3">
      <div class="text-left">
        <slot>
          <h1 class="text-h1">
            <slot name="title"> Oops! </slot>
          </h1>
          <h2 class="text-h2">
            <slot name="subtitle"> {{ message }} </slot>
          </h2>
        </slot>
      </div>
      <div v-if="buttonTo" class="mt-4">
        <NuxtLink
          :to="buttonTo"
          class="font-semibold btn btn-outline btn-orange font"
        >
          {{ buttonText }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    buttonText: {
      default: 'Return Home',
      type: String,
    },
    buttonTo: {
      default: '/',
      type: String,
    },
    error: {
      required: false,
      type: Object,
      default: () => {},
    },
  },
  computed: {
    message() {
      if (this.error.statusCode === 404) return '404 - Page Not found'
      return 'There was an issue.'
    },
  },
}
</script>
