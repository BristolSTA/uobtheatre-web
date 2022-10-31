<template>
  <div ref="map" />
</template>

<script setup lang="ts">
import L from 'leaflet';
import { Ref } from 'vue';
const map = ref(null);
const leafletMapInstance = ref(null);
const emit = defineEmits<{
  (event: 'initalised', mapInstance: Ref<L.Map>): void;
}>();
onMounted(() => {
  nextTick(() => {
    leafletMapInstance.value = L.map(map.value);
    emit('initalised', leafletMapInstance);
  });
});
</script>
