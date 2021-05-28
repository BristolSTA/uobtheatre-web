<template>
  <qrcode-stream
    class="mx-auto md:max-w-md"
    :camera="!on ? 'off' : 'auto'"
    :track="onTrackEvent"
    @init="onInit"
    @decode="onDecode"
  >
    <button
      class="absolute top-0 left-0 p-2 m-4 rounded bg-sta-orange md:hidden"
      @click="$emit('close')"
    >
      Close
    </button>
    <div v-if="on && ready" class="mt-4 text-center">
      <strong>Scan a ticket QR code</strong>
    </div>
    <div
      v-else-if="!ready"
      class="flex flex-col items-center justify-center h-full space-y-3"
    >
      <template v-if="!error">
        <font-awesome-icon icon="circle-notch" class="fa-3x animate-spin" />
        <strong>Loading Scanner...</strong>
      </template>
      <p v-else class="px-1 font-semibold text-center text-sta-rouge-dark">
        Unable to start scanner: {{ error }}
      </p>
    </div>
  </qrcode-stream>
</template>

<script>
import AudioSingle from '@/assets/audio/beep_single.mp3'
import Ticket from '@/classes/Ticket'
import { QrcodeStream } from 'vue-qrcode-reader'
export default {
  components: { QrcodeStream },
  props: {
    on: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      error: null,
      ready: false,
    }
  },
  methods: {
    onTrackEvent(detectedCodes, ctx) {
      for (const detectedCode of detectedCodes) {
        const [firstPoint, ...otherPoints] = detectedCode.cornerPoints
        ctx.strokeStyle = 'red'
        ctx.beginPath()
        ctx.moveTo(firstPoint.x, firstPoint.y)
        for (const { x, y } of otherPoints) {
          ctx.lineTo(x, y)
        }
        ctx.lineTo(firstPoint.x, firstPoint.y)
        ctx.closePath()
        ctx.stroke()
      }
    },
    async onInit(promise) {
      try {
        await promise
        this.ready = true
        this.$emit('ready')
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          // user denied camera access permisson
          this.error = 'Camera access denied due to user permissions'
        } else if (error.name === 'NotFoundError') {
          // no suitable camera device installed
          this.error = 'No camera available on device'
        } else if (
          error.name === 'NotSupportedError' ||
          error.name === 'InsecureContextError'
        ) {
          // page is not served over HTTPS (or localhost)
          this.error = 'Camera access denied for security'
        } else if (error.name === 'NotReadableError') {
          // maybe camera is already in use
          this.error = 'Camera is already in use'
        } else if (error.name === 'OverconstrainedError') {
          // did you requested the front camera although there is none?
          this.error = 'Unable to find supported camera'
        } else if (error.name === 'StreamApiNotSupportedError') {
          // browser seems to be lacking features
          this.error = 'Browser unsupported'
        } else {
          throw error
        }
        this.$emit('unable', this.error)
      }
    },
    onDecode(string) {
      new Audio(AudioSingle).play()

      try {
        const ticketData = Ticket.dataFromQRCode(string)
        this.$emit('scan', ticketData)
      } catch (e) {
        const isAllowedSilentException =
          e instanceof SyntaxError ||
          (e instanceof DOMException &&
            e.message.includes(
              'The string to be decoded is not correctly encoded'
            ))
        this.$emit('invalidCode')
        if (!isAllowedSilentException) throw e
      }
    },
  },
}
</script>
