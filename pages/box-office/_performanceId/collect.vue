<template>
  <div class="container">
    <div class="sm:py-6">
      <overview
        :production="performance.production"
        :performance="performance"
        :detailed="false"
      />
    </div>

    <!-- <check-in-notification /> -->

    <camera-check-in :performance-id="performance.id" />

    <div class="flex justify-center mt-6">
      <div class="p-5 text-lg bg-sta-green">Using a camera?</div>
    </div>
  </div>
</template>

<script>
import Overview from '@/components/box-office/Overview.vue'
import CameraCheckIn from '@/components/box-office/CameraCheckIn.vue'
// import CheckInNotification from '@/components/box-office/CheckInNotification.vue'

export default {
  components: { Overview, CameraCheckIn },
  props: {
    performance: {
      required: true,
      type: Object,
    },
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
