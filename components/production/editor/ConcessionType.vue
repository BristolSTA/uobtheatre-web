<template>
  <div class="p-3 rounded-lg bg-sta-gray-dark">
    <div class="flex items-center">
      <p
        class="font-semibold"
        :class="{
          'hover:text-sta-orange transition-colors cursor-pointer': editable,
        }"
        @click="editable ? (editing = !editing) : null"
      >
        {{ name }}
      </p>
      <div class="ml-auto space-x-4">
        <font-awesome-icon
          v-if="editable"
          class="transition-colors cursor-pointer hover:text-sta-orange"
          icon="edit"
          @click="editing = !editing"
        />
        <font-awesome-icon
          v-if="removable"
          class="transition-colors cursor-pointer hover:text-sta-rouge"
          icon="trash"
          @click="$emit('remove')"
        />
      </div>
    </div>
    <div v-if="editable && editing">
      <form-label>
        Name
        <template #control>
          <t-input
            :value="name"
            placeholder="e.g. Student"
            @input="$emit('update:name', $event)"
          />
        </template>
      </form-label>
      <form-label>
        Description
        <template #control>
          <t-input
            :value="description"
            placeholder="e.g. Valid ID card required"
            @input="$emit('update:description', $event)"
          />
        </template>
      </form-label>
    </div>
  </div>
</template>

<script>
import FormLabel from '@/components/ui/FormLabel.vue'

export default {
  components: { FormLabel },
  props: {
    name: {
      required: true,
      type: String,
    },
    description: {
      required: true,
      type: String,
    },
    editable: {
      default: false,
      type: Boolean,
    },
    removable: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      editing: false,
    }
  },
}
</script>
