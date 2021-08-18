<template>
  <div>
    <h3
      class="
        text-sm
        font-bold
        tracking-wide
        uppercase
        select-none
        text-sta-gray-light
      "
    >
      {{ name }}
    </h3>
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
