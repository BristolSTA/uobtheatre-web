<template>
  <div>
    <h2 class="font-bold">Scan a Ticket</h2>
    <text-input
      ref="input"
      :value="value"
      :placeholder="placeholder"
      :input-class="[
        focused
          ? 'focus:ring-sta-green'
          : 'ring-sta-rouge bg-sta-rouge bg-opacity-40 placeholder-white',
        'py-3 text-center ring focus:outline-none',
      ]"
      @input="$emit('input', $event)"
      @change="handleScan"
      @blur="focused = false"
      @focus="focused = true"
    />

    <invalid-code-notification
      v-if="invalidCode"
      class="mt-4"
      @close="invalidCode = false"
    />
  </div>
</template>

<script>
import Ticket from '@/classes/Ticket'
import TextInput from '../ui/TextInput.vue'
import InvalidCodeNotification from './InvalidCodeNotification.vue'
export default {
  components: { TextInput, InvalidCodeNotification },
  props: {
    value: {
      default: null,
      type: String,
    },
  },
  data() {
    return {
      placeholder: 'Scan a Ticket...',
      invalidCode: false,
      focused: true,
    }
  },
  watch: {
    focused(newVal) {
      if (newVal) this.placeholder = 'Scan a Ticket...'
      else this.placeholder = 'Click here to scan'
    },
    value() {
      this.invalidCode = false
    },
    invalidCode(newVal) {
      if (newVal) this.$emit('invalidCode')
    },
  },
  mounted() {
    this.$refs.input.focus()
  },
  methods: {
    handleScan($event) {
      const code = $event.target.value
      if (!code) return
      try {
        const { bookingReference, ticketId } = Ticket.dataFromQRCode(code)
        this.$emit('scanned', { bookingReference, ticketId })
      } catch (e) {
        const isAllowedSilentException =
          e instanceof SyntaxError ||
          (e instanceof DOMException &&
            e.message.includes(
              'The string to be decoded is not correctly encoded'
            ))
        this.invalidCode = true
        if (!isAllowedSilentException) throw e
      }
    },
  },
}
</script>
