<template>
  <label :for="inputId">
    <span class="text-xs font-semibold text-white">{{ name }}</span>
    <input
      :id="inputId"
      class="w-full p-1 rounded-sm focus:outline-none"
      :name="inputId"
      :type="type"
      :value="value"
      :autocomplete="autocomplete"
      @input="onInput"
    >
    <span
      v-if="errors && errors.has(inputId)"
      class="text-xs font-semibold text-sta-rouge"
    >{{ errors.get(inputId) }}</span>
  </label>
</template>

<script>
export default {
  name: 'TextInput',
  props: {
    value: {
      required: true,
      type: String,
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
    },
    errors: {
      required: false,
    },
  },
  computed: {
    inputId() {
      return this.name.replace(/ /g, '_').toLowerCase();
    },
  },
  methods: {
    onInput(event) {
      this.$emit('input', event.target.value);
      if (this.errors) {
        this.errors.clear(this.inputId);
      }
    },
  },
};
</script>
