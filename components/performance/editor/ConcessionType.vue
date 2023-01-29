<template>
  <div class="p-3 bg-sta-gray-dark rounded-lg">
    <div class="flex items-center">
      <p
        class="font-semibold"
        :class="{
          'hover:text-sta-orange transition-colors cursor-pointer': editable
        }"
        @click="editable ? (editing = !editing) : null"
      >
        {{ name }}
      </p>
      <div class="ml-auto space-x-4">
        <font-awesome-icon
          v-if="editable"
          class="hover:text-sta-orange cursor-pointer transition-colors"
          icon="edit"
          @click="editing = !editing"
        />
        <font-awesome-icon
          v-if="removable"
          class="hover:text-sta-rouge cursor-pointer transition-colors"
          icon="trash"
          @click="$emit('remove')"
        />
      </div>
    </div>
    <div v-if="editable && editing">
      <form-label :required="true">
        Name
        <template #control>
          <UiInputText
            :model-value="name"
            placeholder="e.g. Student"
            @update:model-value="$emit('update:name', $event)"
          />
        </template>
      </form-label>
      <form-label>
        Description
        <template #control>
          <UiInputText
            :model-value="description"
            placeholder="e.g. Valid ID card required"
            @update:model-value="$emit('update:description', $event)"
          />
        </template>
      </form-label>
      <slot name="editor-footer" />
    </div>
  </div>
</template>

<script>
import FormLabel from '@/components/ui/FormLabel.vue';

export default {
  components: { FormLabel },
  props: {
    name: {
      required: true,
      type: String
    },
    description: {
      default: null,
      type: String
    },
    editable: {
      default: false,
      type: Boolean
    },
    removable: {
      default: false,
      type: Boolean
    }
  },
  emits: ['remove', 'update:name', 'update:description'],
  data() {
    return {
      editing: false
    };
  }
};
</script>
