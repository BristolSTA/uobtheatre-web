<template>
  <div>
    <select
      v-model="value"
      class="text-black w-full"
      :disabled="props.disabled"
    >
      <option v-if="props.placeholder" disabled selected>
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
  modelValue: string;
  disabled: boolean;
  placeholder: string | undefined;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
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
