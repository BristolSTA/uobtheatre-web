<template>
  <div>
    <h4 class="font-semibold uppercase text-sta-green">
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
