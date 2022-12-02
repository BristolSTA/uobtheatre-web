<template>
  <div class="text-black">
    <select
      v-model="value"
      class="text-black w-full"
      :disabled="props.disabled"
    >
      <option v-if="props.placeholder" value="" disabled selected>
        {{ props.placeholder }}
      </option>
      <option
        v-for="(option, i) in props.options"
        :key="i"
        :value="option.value"
      >
        {{ option.displayText }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
interface Option {
  displayText: string;
  value: string;
}

interface Props {
  options: Option[];
  modelValue?: string | null;
  disabled?: boolean;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  placeholder: undefined,
  modelValue: undefined
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | null): void;
}>();

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  }
});
</script>
