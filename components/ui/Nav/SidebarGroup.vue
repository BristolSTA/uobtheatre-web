<template>
  <div>
    <h3
      class="text-sta-gray-light text-sm font-bold tracking-wide select-none uppercase"
    >
      {{ name }}
    </h3>
    <slot />
  </div>
</template>

<script>
export default defineNuxtComponent({
  props: {
    name: {
      required: true,
      type: String
    }
  }
});
</script>
