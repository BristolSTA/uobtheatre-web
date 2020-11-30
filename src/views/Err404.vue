<template>
  <div class="flex items-center justify-center w-full h-full bg-sta-gray">
    <div class="w-full px-10 text-white sm:px-0 sm:w-1/2 xl:w-1/3">
      <div class="text-left">
        <h1 class="text-h1">Oops!</h1>
        <h2 class="text-h2">404-Page Not found</h2>
      </div>
      <div class="mt-4">
        <router-link
          to="/"
          class="font-semibold btn btn-outline btn-orange font"
          >Return Home</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'production-performances',
};
</script>
