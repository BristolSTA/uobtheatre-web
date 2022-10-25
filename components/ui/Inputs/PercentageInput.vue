<template>
  <t-input
    ref="inputRef"
    type="number"
    min="0"
    max="100"
    max-length="3"
    :value="value"
    @input="onInput"
    @blur="onBlur"
    @keypress.stop="
      () => {
        if (!/^[0-9.]$/i.test($event.key)) $event.preventDefault();
      }
    "
  />
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: null,
    },
    options: {
      default: null,
      type: Object,
    },
  },
  methods: {
    onInput(event) {
      this.$emit("input", event);
    },
    onBlur(event) {
      let newVal = event.target.value;
      if (newVal > 100) {
        newVal = 100;
      }
      if (newVal < 0) {
        newVal = 0;
      }
      this.$emit("input", newVal);
      this.$emit("blur", newVal);
    },
  },
};
</script>
