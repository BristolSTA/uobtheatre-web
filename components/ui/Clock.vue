<template>
  <div v-if="hours | minutes | seconds" class="font-mono">
    {{ hours }}:{{ minutes }}:{{ seconds }}
  </div>
</template>

<script>
export function getZeroPad(n) {
  return (parseInt(n, 10) >= 10 ? '' : '0') + n
}

export default {
  data() {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
  },
  mounted() {
    this.$options.timer = window.setTimeout(this.updateDateTime, 1000)
  },
  beforeDestroy() {
    window.clearTimeout(this.$options.timer)
  },
  methods: {
    updateDateTime() {
      const now = new Date()
      this.hours = getZeroPad(now.getHours())
      this.minutes = getZeroPad(now.getMinutes())
      this.seconds = getZeroPad(now.getSeconds())
      this.$options.timer = window.setTimeout(this.updateDateTime, 1000)
    },
  },
}
</script>
