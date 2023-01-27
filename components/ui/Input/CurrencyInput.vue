<template>
  <UiInputText ref="inputRef" :model-value="formattedValue" />
</template>

<script lang="ts" setup>
import { useCurrencyInput } from 'vue-currency-input';

const props = withDefaults(
  defineProps<{
    modelValue: number;
    options?: Object;
    allowNegative?: boolean;
  }>(),
  {
    options: () => ({}),
    allowNegative: false
  }
);

const { formattedValue, inputRef } = useCurrencyInput(
  Object.assign(
    {
      currency: 'GBP',
      precision: 2,
      valueRange: {
        min: props.allowNegative ? undefined : 0
      }
    },
    props.options
  )
);
</script>
