<template>
  <div
    v-if="['Draft', 'Pending', 'Approved'].includes(status)"
    class="bg-sta-orange text-center w-full py-1"
  >
    {{ status }} Production Preview - This Page Is Not Public Yet
  </div>
</template>

<script setup lang="ts">
import ProductionStatusEnum from '~~/enums/ProductionStatusEnum';

const props = defineProps({
  production: {
    required: true,
    type: Object
  }
});

const status = computed<string>(() => {
  return new ProductionStatusEnum(props.production.status).name;
});
</script>
