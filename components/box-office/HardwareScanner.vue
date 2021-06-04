<template>
  <div>
    <h2 class="font-bold">Scan a Ticket</h2>
    <text-input
      ref="input"
      :value="value"
      :placeholder="placeholder"
      input-class="py-3 text-center focus:ring ring-sta-green"
      @input="$emit('input', $event)"
      @change="handleScan"
      @blur="placeholder = 'Click here then scan'"
      @focus="placeholder = 'Scan a Ticket...'"
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
    }
  },
  watch: {
    value() {
      this.invalidCode = false
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
