<template>
  <UiInputText
    ref="inputRef"
    type="number"
    min="0"
    max="100"
    max-length="3"
    :model-value="modelValue"
    @blur="onBlur"
    @keypress.stop="
      (event) => {
        if (!/^[0-9.]$/i.test(event.key)) event.preventDefault();
      }
    "
  />
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Number,
      default: null
    },
    options: {
      default: null,
      type: Object
    }
  },
  emits: ['blur'],
  methods: {
    onInput(event) {
      this.$emit('update:modelValue', event);
    },
    onBlur(event) {
      let newVal = event.target.value;
      if (newVal > 100) {
        newVal = 100;
      }
      if (newVal < 0) {
        newVal = 0;
      }
      this.$emit('update:modelValue', newVal);
      this.$emit('blur', newVal);
    }
  }
};
</script>
