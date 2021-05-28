<template>
  <div class="container">
    <div class="py-1 sm:py-6">
      <overview
        :production="performance.production"
        :performance="performance"
        :detailed="false"
      />
    </div>

    <camera-check-in
      v-if="showCamera"
      :performance-id="performance.id"
      @close="showCamera = false"
    />
    <hardware-scanner-check-in v-else :performance-id="performance.id" />

    <div class="flex justify-center my-6">
      <button
        class="p-5 text-lg bg-sta-green"
        @click="showCamera = !showCamera"
      >
        <template v-if="!showCamera"
          >Activate Camera Ticket Scanner Instead</template
        >
        <template v-if="showCamera">Use Hardware-based Scanner</template>
      </button>
    </div>
  </div>
</template>

<script>
import Overview from '@/components/box-office/Overview.vue'
import CameraCheckIn from '@/components/box-office/CameraCheckIn.vue'
import HardwareScannerCheckIn from '@/components/box-office/HardwareScannerCheckIn.vue'

export default {
  components: { Overview, CameraCheckIn, HardwareScannerCheckIn },
  props: {
    performance: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      showCamera: false,
    }
  },
  computed: {
    crumbs() {
      return [
        { text: 'Box Office', route: '/box-office' },
        {
          text: `${
            this.performance.production.name
          } on ${this.$options.filters.dateFormat(
            this.performance.start,
            'ccc dd MMM T'
          )}`,
          route: `/box-office/${this.performance.id}`,
        },
        {
          text: 'Collect or Check',
        },
      ]
    },
  },
}
</script>
