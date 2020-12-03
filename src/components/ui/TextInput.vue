<template>
  <label :for="inputId">
    <span class="text-white text-xs font-semibold">{{ name }}</span>
    <input
      class="w-full p-1 rounded-sm focus:outline-none"
      :id="inputId"
      :value="value"
      :autocomplete="autocomplete"
      @input="$emit('input', $event.target.value)"
      :type="input_type"
    />
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
    input_type: {
      required: false,
    },
    autocomplete: {
      required: false,
    },
  },
  computed: {
    inputId() {
      return this.name.replace(' ', '_').toLowerCase();
    },
  },
};
</script>
