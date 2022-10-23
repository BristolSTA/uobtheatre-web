<template>
  <t-input ref="inputRef" :value="formattedValue" />
</template>

<script>
import useCurrencyInput from 'vue-currency-input'

export default {
  props: {
    value: {
      type: Number,
      default: null
    },
    options: {
      default: null,
      type: Object
    },
    allowNegative: {
      default: false,
      type: Boolean
    }
  },
  setup (props) {
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
    )

    return { inputRef, formattedValue }
  }
}
</script>
