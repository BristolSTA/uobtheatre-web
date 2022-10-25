<template>
  <div class="font-mono">{{ hours }}:{{ minutes }}:{{ seconds }}</div>
</template>

<script>
export function getZeroPad(n) {
  return (parseInt(n, 10) >= 10 ? "" : "0") + n;
}

export default {
  data() {
    return {
      timer: null,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  },
  mounted() {
    this.updateDateTime();
    this.timer = setInterval(this.updateDateTime, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    updateDateTime() {
      const now = new Date();
      this.hours = getZeroPad(now.getHours());
      this.minutes = getZeroPad(now.getMinutes());
      this.seconds = getZeroPad(now.getSeconds());
      this.$emit("time", now);
    },
  },
};
</script>
