<template>
  <div>
    <template v-if="showCamera">
      <camera-check-in
        v-if="checkInMode"
        :performance-id="performanceId"
        @scanned="$emit('scanned', $event)"
        @close="showCamera = false"
      />
      <BoxOfficeCameraScanner
        v-else
        @scanned="$emit('scanned', $event)"
        @invalid-code="$emit('invalidCode')"
        @close="showCamera = false"
      />
    </template>
    <template v-else>
      <hardware-scanner-check-in
        v-if="checkInMode"
        :performance-id="performanceId"
        @scanned="$emit('scanned', $event)"
        @invalid-code="$emit('invalidCode')"
      />
      <hardware-scanner
        v-else
        @scanned="$emit('scanned', $event)"
        @invalid-code="$emit('invalidCode')"
      />
    </template>

    <div class="flex justify-center my-6">
      <button
        class="p-5 text-lg bg-sta-green"
        @click="showCamera = !showCamera"
      >
        <div v-if="!showCamera" class="flex items-center">
          <div class="px-4">
            <font-awesome-icon icon="mobile-alt" class="fa-2x" />
          </div>
          <div class="text-center">
            <p><strong>On a mobile?</strong></p>
            Switch to Camera-based Scanner
          </div>
        </div>
        <template v-if="showCamera">
          Switch to Hardware-based Scanner
        </template>
      </button>
    </div>
  </div>
</template>

<script>
import CameraCheckIn from '@/components/box-office/CameraCheckIn.vue';
import HardwareScannerCheckIn from '@/components/box-office/HardwareScannerCheckIn.vue';
import HardwareScanner from '@/components/box-office/HardwareScanner.vue';
export default {
  components: {
    CameraCheckIn,
    HardwareScannerCheckIn,
    HardwareScanner
  },
  props: {
    checkInMode: {
      default: false,
      type: Boolean
    },
    performanceId: {
      default: null,
      type: [Number, String]
    }
  },
  emits: ['scanned', 'invalidCode'],
  data() {
    return {
      showCamera: false
    };
  },
  mounted() {
    if (this.checkInMode && !this.performanceId) {
      throw new Error('Performance ID must be supplied in check in mode');
    }
  }
};
</script>
