<template>
  <t-input ref="inputRef" :value="formattedValue" />
</template>

<script>
import useCurrencyInput from 'vue-currency-input'

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
  setup(props) {
    const { formattedValue, inputRef } = useCurrencyInput(
      Object.assign(
        {
          currency: 'GBP',
          precision: 0,
          currencyDisplay: 'hidden',
          valueRange: { min: 0, max: 100 },
        },
        props.options
      )
    )

    return { inputRef, formattedValue }
  },
}
</script>
