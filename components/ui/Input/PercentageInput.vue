<template>
  <UiInputText
    ref="inputRef"
    type="number"
    min="0"
    max="100"
    max-length="3"
    :model-value="modelValue"
    @update:model-value="onInput"
    @blur="onBlur"
    @keypress.stop="
      () => {
        if (!/^[0-9.]$/i.test($event.key)) $event.preventDefault();
      }
    "
  />
</template>

<script>
export default defineNuxtComponent({
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
  methods: {
    onInput(event) {
      this.$emit('update:model-value', event);
    },
    onBlur(event) {
      let newVal = event.target.value;
      if (newVal > 100) {
        newVal = 100;
      }
      if (newVal < 0) {
        newVal = 0;
      }
      this.$emit('input', newVal);
      this.$emit('blur', newVal);
    }
  }
});
</script>
