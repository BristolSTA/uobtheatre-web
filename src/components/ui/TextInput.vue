<template>
  <label :for="inputId">
    <span class="text-white text-xs font-semibold">{{ name }}</span>
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
      class="text-sta-rouge text-xs font-semibold"
    >{{ errors.get(inputId) }}</span>
  </label>
</template>

<script>
export default {
  name: 'TextInput',
  props: {
    value: {
      required: true,
    },
    name: {
      required: true,
    },
    type: {
      default: 'text',
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
