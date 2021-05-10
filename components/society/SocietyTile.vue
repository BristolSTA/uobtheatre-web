<template>
  <div
    class="flex justify-center px-4 mx-12 cursor-pointer society-tile sm:px-0 hover:text-sta-green"
  >
    <NuxtLink :to="`/society/${society.slug}`" class="w-full">
      <div class="flex justify-center w-full">
        <img class="w-40" :src="society.logo.url" alt="society logo" />
      </div>

      <h2
        class="w-full text-2xl font-semibold text-center transition-color text-sta-orange society-title"
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
      type: Object,
    },
  },
}
</script>

<style scoped lang="scss">
.society-tile:hover .society-title {
  @apply text-sta-green;
}
</style>
