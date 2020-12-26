<template>
  <label :for="inputId">
    <span class="text-white text-xs font-semibold">{{ name }}</span>
    <input
      class="w-full p-1 rounded-sm focus:outline-none"
      :id="inputId"
      :name="inputId"
      :type="type"
      :value="value"
      :autocomplete="autocomplete"
      @input="onInput"
    />
    <span
      class="text-sta-rouge text-xs font-semibold"
      v-if="errors && errors.has(inputId)"
      >{{ errors.get(inputId) }}</span
    >
  </label>
</template>

<script>
export default {
  name: 'text-input',
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
  methods: {
    onInput(event) {
      this.$emit('input', event.target.value);
      if (this.errors) {
        this.errors.clear(this.inputId);
      }
    },
  },
  computed: {
    inputId() {
      return this.name.replace(/ /g, '_').toLowerCase();
    },
  },
};
</script>
