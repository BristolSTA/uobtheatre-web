<template>
  <div
    class="
      society-tile
      flex
      justify-center
      mx-12
      px-4
      hover:text-sta-green
      cursor-pointer
      transition-all
      hover:drop-shadow-dark
      drop-shadow-none
      filter
      sm:px-0
    "
  >
    <NuxtLink :to="`/society/${society.slug}`" class="w-full">
      <div class="flex justify-center w-full">
        <img class="w-40" :src="society.logo.url" alt="society logo">
      </div>

      <h2
        class="
          society-title
          w-full
          text-center text-sta-orange text-2xl
          font-semibold
          transition-colors
        "
      >
        {{ society.name }}
      </h2>
    </NuxtLink>
  </div>
</template>

<script>
export default {
  props: {
    society: {
      required: true,
      type: Object
    }
  }
}
</script>

<style scoped lang="scss">
.society-tile:hover .society-title {
  @apply text-sta-green;
}
</style>
