<template>
  <div>
    <input
      :id="inputId"
      ref="input"
      class="px-2 py-2 w-full text-black rounded-sm focus:outline-none rounded"
      :class="inputClass"
      :name="inputId"
      :type="type"
      :value="modelValue"
      :autocomplete="autocomplete"
      :required="required"
      :placeholder="placeholder"
      @input="onInput"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
      @change="$emit('change', $event)"
    />
    <error-helper :errors="errors" :field-name="inputId" />
  </div>
</template>

<script>
import lo from 'lodash';

import ErrorHelper from '../ErrorHelper.vue';
import Errors from '~~/classes/Errors';

export default {
  name: 'TextInput',
  components: { ErrorHelper },
  props: {
    modelValue: {
      default: null,
      type: [String, null]
    },
    placeholder: {
      default: null,
      type: String
    },
    inputClass: {
      default: null,
      type: [String, Array, Object]
    },
    name: {
      default: null,
      type: String
    },
    type: {
      default: 'text',
      type: String
    },
    autocomplete: {
      required: false,
      validator: () => true,
      default: null,
      type: String
    },
    errors: {
      required: false,
      type: Errors,
      default: null
    },
    required: {
      required: false,
      default: false,
      type: Boolean
    },
    errorKey: {
      required: false,
      default: null,
      type: String
    },
    showLabel: {
      default: true,
      type: Boolean
    }
  },
  emits: ['focus', 'blur', 'change', 'update:modelValue'],
  computed: {
    inputId() {
      return (
        this.errorKey ?? lo.chain(this.name).lowerCase().camelCase().value()
      );
    }
  },
  methods: {
    onInput(event) {
      this.$emit('update:modelValue', event.target.value);
      if (this.errors) {
        this.errors.clear(this.inputId);
      }
    },
    focus() {
      this.$refs.input.focus();
    }
  }
};
</script>
