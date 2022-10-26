<template>
  <div class="relative flex p-2 bg-sta-rouge space-x-6">
    <div class="absolute right-0 top-0 mr-2">
      <font-awesome-icon
        icon="times"
        class="fa-2x cursor-pointer"
        @click="$emit('close')"
      />
    </div>
    <div class="w-16 text-center">
      <font-awesome-icon icon="exclamation" class="fa-4x my-auto" />
    </div>
    <div>
      <strong>Invalid Code Scanned</strong>
      <p>A code was scanned that was of an unrecognised or invalid format</p>
    </div>
  </div>
</template>

<script>
import AudioNegative from '@/assets/audio/beep_negative.mp3';
export default {
  mounted() {
    new Audio(AudioNegative).play();
  },
};
</script>
