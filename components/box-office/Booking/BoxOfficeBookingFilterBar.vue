<template>
  <div class="flex items-end gap-5">
    <UiInputText
      :model-value="textSearchValue"
      placeholder="Search for a name, email or booking reference"
      class="grow"
      @update:model-value="emit('update:textSearchValue', $event)"
    />
    <UiFormLabel>
      Filter
      <template #control>
        <UiInputSelect
          :model-value="filterValue"
          :options="[
            { value: null, displayText: 'All' },
            { value: 'COMPS', displayText: 'Comps Only' },
            { value: 'NOCHECKIN', displayText: 'Not Checked In' }
          ]"
          @update:model-value="emit('update:filterValue', $event)" /></template
    ></UiFormLabel>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  textSearchValue: string;
  filterValue?: string | null;
}>();
const emit = defineEmits<{
  (event: 'update:textSearchValue', value: string): void;
  (event: 'update:filterValue', value?: string | null): void;
}>();
</script>
