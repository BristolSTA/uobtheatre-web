<template>
  <div class="flex items-center justify-center space-x-2">
    <font-awesome-icon
      :icon="
        (editing ? editingData[ticket.id] : ticket.checkedIn)
          ? 'check-circle'
          : 'times-circle'
      "
      :class="[
        (editing ? editingData[ticket.id] : ticket.checkedIn)
          ? 'text-sta-green'
          : 'text-sta-rouge',
      ]"
    />
    <button
      v-if="editing && !saving"
      class="
        flex-none
        p-1
        bg-sta-orange
        hover:bg-sta-orange-dark
        rounded
        focus:outline-none
        transition-colors
      "
      @click="$emit('btn-press')"
    >
      {{ editingData[ticket.id] ? 'Un-Check In' : 'Check In' }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    ticket: {
      required: true,
      type: Object,
    },
    editing: {
      required: true,
      type: Boolean,
    },
    editingData: {
      required: true,
      type: Array,
    },
  },
}
</script>
