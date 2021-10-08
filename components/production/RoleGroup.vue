<template>
  <div>
    <h4 class="text-sta-green font-semibold uppercase">
      {{ name }}
    </h4>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      required: true,
      type: String,
    },
  },
}
</script>
