<template>
  <div ref="map" />
</template>

<script setup lang="ts">
import L from 'leaflet';
import type { Ref } from 'vue';
const map = ref<HTMLDivElement | undefined>(undefined);
const leafletMapInstance = ref<L.Map | undefined>(undefined);
const emit = defineEmits<{
  (event: 'initalised', mapInstance: Ref): void;
}>();

onMounted(() => {
  nextTick(() => {
    if (!map.value) return;
    // @ts-ignore
    leafletMapInstance.value = L.map(map.value);
    emit('initalised', leafletMapInstance);
  });
});
</script>
