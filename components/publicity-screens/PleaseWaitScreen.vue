<template>
  <div class="flex flex-col h-full justify-evenly items-center w-screen">
    <h1 class="text-rmd font-bold text-center">
      Welcome to this performance of<br />
      <span class="text-sta-gold text-rlg">{{ production.name }}</span>
    </h1>
    <img
      class="flex-shrink"
      :src="production.featuredImage.url"
      style="max-width: 100%; width: 50vw"
    />
    <h2 class="text-rmd">
      <u>Please wait here.</u> The Box Office will be opening shortly.
    </h2>
  </div>
</template>

<script>
export default {
  props: {
    performance: {
      required: true,
      type: Object,
    },
    production: {
      required: true,
      type: Object,
    },
  },
}
</script>
