<template>
  <div class="flex p-2 space-x-6 bg-sta-rouge relative">
    <div class="absolute top-0 right-0 mr-2">
      <font-awesome-icon
        icon="times"
        class="cursor-pointer fa-2x"
        @click="$emit('close')"
      />
    </div>
    <div class="w-16 text-center">
      <font-awesome-icon icon="exclamation" class="my-auto fa-4x" />
    </div>
    <div>
      <strong>Invalid Code Scanned</strong>
      <p>A code was scanned that was of an unrecognised or invalid format</p>
    </div>
  </div>
</template>

<script>
import AudioNegative from '@/assets/audio/beep_negative.mp3'
export default {
  mounted() {
    new Audio(AudioNegative).play()
  },
}
</script>
