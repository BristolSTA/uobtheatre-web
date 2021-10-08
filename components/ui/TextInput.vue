<template>
  <label :for="inputId">
    <span v-if="showLabel" class="text-white text-xs font-semibold">{{
      name
    }}</span>
    <input
      :id="inputId"
      ref="input"
      class="p-1 w-full text-black rounded-sm focus:outline-none"
      v-bind="$attrs"
      :class="inputClass"
      :name="inputId"
      :type="type"
      :value="value"
      :autocomplete="autocomplete"
      :required="required"
      @input="onInput"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
      @change="$emit('change', $event)"
    />
    <error-helper :errors="errors" :field-name="inputId" />
  </label>
</template>

<script>
import lo from 'lodash'

import Errors from '@/classes/Errors'

import ErrorHelper from './ErrorHelper.vue'
export default {
  name: 'TextInput',
  components: { ErrorHelper },
  inheritAttrs: false,
  props: {
    value: {
      required: true,
      validator: () => true,
    },
    inputClass: {
      default: null,
      type: [String, Array, Object],
    },
    name: {
      default: null,
      type: String,
    },
    type: {
      default: 'text',
      type: String,
    },
    autocomplete: {
      required: false,
      validator: () => true,
      default: null,
    },
    errors: {
      required: false,
      type: Errors,
      default: null,
    },
    required: {
      required: false,
      default: false,
      type: Boolean,
    },
    errorKey: {
      required: false,
      default: null,
      type: String,
    },
    showLabel: {
      default: true,
      type: Boolean,
    },
  },
  computed: {
    inputId() {
      return (
        this.errorKey ?? lo.chain(this.name).lowerCase().camelCase().value()
      )
    },
  },
  methods: {
    onInput(event) {
      this.$emit('input', event.target.value)
      if (this.errors) {
        this.errors.clear(this.inputId)
      }
    },
    focus() {
      this.$refs.input.focus()
    },
  },
}
</script>
