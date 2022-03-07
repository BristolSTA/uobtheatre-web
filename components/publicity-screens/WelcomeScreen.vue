<template>
  <div class="flex flex-col h-full justify-evenly items-center w-screen">
    <h1 class="text-sta-gold text-rlg font-bold text-center">
      {{ production.name }}
    </h1>
    <img
      :src="production.featuredImage.url"
      style="max-width: 100%; width: 50vw"
    />
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
