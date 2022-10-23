<template>
  <span>
    {{
      remainingDuration
        ? humanizeDuration(remainingDuration.toMillis(), {
          round: true,
          largest: 1,
        })
        : ''
    }}
  </span>
</template>

<script>
import { DateTime, Duration } from 'luxon'
import humanizeDuration from 'humanize-duration'
export default {
  props: {
    expiresAt: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      remainingDuration: null,
      intervalTimer: null
    }
  },
  computed: {
    expiresAtDate () {
      return DateTime.fromISO(this.expiresAt)
    },
    countdownToShow () {
      if (!this.remainingDuration) { return null }

      return this.remainingDuration
    }
  },
  mounted () {
    this.calculateRemainingSeconds()
    this.intervalTimer = setInterval(this.calculateRemainingSeconds, 500)
  },
  beforeDestroy () {
    clearInterval(this.intervalTimer)
  },
  methods: {
    humanizeDuration,
    calculateRemainingSeconds () {
      this.remainingDuration = this.expiresAtDate.diffNow('minutes')
      if (this.remainingDuration.toMillis() <= 0) {
        this.remainingDuration = Duration.fromMillis(0)
        this.$emit('finished')
      }
    }
  }
}
</script>
