<template>
  <div class="font-mono">{{ hours }}:{{ minutes }}:{{ seconds }}</div>
</template>

<script lang="ts" setup>
function getZeroPad(n: number) {
  return (n >= 10 ? '' : '0') + n;
}

const now = useClock();

const hours = computed(() => {
  return getZeroPad(now.value.hour);
});
const minutes = computed(() => {
  return getZeroPad(now.value.minute);
});
const seconds = computed(() => {
  return getZeroPad(now.value.second);
});
</script>
