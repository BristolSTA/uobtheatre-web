<template>
  <div
    class="
      h-full
      w-full
      bg-sta-gold
      text-black
      flex flex-col
      justify-center
      items-center
      text-center
      space-y-10
      p-5
    "
  >
    <h1 class="text-rlg font-bold">
      This performance of {{ performance.production.name }} is sold out
    </h1>
    <h2 class="text-rmd">
      There are no tickets available on the door
    </h2>
  </div>
</template>

<script>
export default {
  props: {
    performance: {
      type: Object,
      default: null
    }
  }
}
</script>
