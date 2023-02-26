<template>
  <div>
    <div class="flex items-center gap-4">
      <UiInputToggle v-model="value" />
      <div class="flex flex-col items-center font-bold">
        <p class="text-white">Auto Check-In</p>
        <p :class="[value ? positiveTextClass : negativeTextClass]">
          {{ value ? 'Enabled' : 'Disabled' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    positiveTextClass?: string;
    negativeTextClass?: string;
  }>(),
  {
    positiveTextClass: 'text-sta-gray-lighter',
    negativeTextClass: 'text-sta-gray-lighter'
  }
);
const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
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
