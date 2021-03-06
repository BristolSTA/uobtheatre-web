<template>
  <label :for="inputId">
    <span v-if="showLabel" class="text-xs font-semibold text-white">{{
      name
    }}</span>
    <input
      :id="inputId"
      class="w-full p-1 text-black rounded-sm focus:outline-none"
      :name="inputId"
      :type="type"
      :value="value"
      :autocomplete="autocomplete"
      :required="required"
      @input="onInput"
      @blur="$emit('blur')"
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
  props: {
    value: {
      required: true,
      validator: () => true,
    },
    name: {
      required: true,
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
  },
}
</script>
