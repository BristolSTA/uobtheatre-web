<template>
  <div>
    <textarea
      class="w-full text-black"
      :value="props.modelValue || ''"
      :placeholder="props.placeholder"
      @input="
        emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    ></textarea>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  modelValue?: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | null): void;
}>();
</script>
