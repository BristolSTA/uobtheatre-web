<template>
  <div class="flex items-center justify-center w-full h-full bg-sta-gray">
    <div class="px-10 w-full text-white sm:px-0 sm:w-1/2 xl:w-1/3">
      <div class="text-left">
        <slot>
          <h1 class="text-h1">
            <slot name="title">
              Oops!
            </slot>
          </h1>
          <h2 class="text-h2">
            <slot name="subtitle">
              {{ message }}
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
      type: String
    },
    buttonTo: {
      default: '/',
      type: String
    },
    error: {
      required: false,
      type: Object,
      default: () => {}
    }
  },
  computed: {
    message () {
      if (this.error.statusCode === 404) { return '404 - Page Not found' }
      if (this.error.statusCode === 401) { return '401 - Unauthorized' }
      return 'There was an issue.'
    }
  }
}
</script>
