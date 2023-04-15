<template>
  <div
    v-if="['Draft', 'Pending', 'Approved'].includes(status.name)"
    ref="draft-banner"
    class="bg-sta-orange text-center w-full py-1"
  >
    {{ status.name }} Production Preview - This Page Is Not Public Yet
  </div>
</template>

<script setup lang="ts">
import ProductionStatusEnum from '~~/enums/ProductionStatusEnum';
import { ProductionNode } from '~~/graphql/codegen/operations';

const props = defineProps<{
  production: Pick<ProductionNode, 'status'>;
}>();

const status = computed<ProductionStatusEnum>(() => {
  return new ProductionStatusEnum(props.production.status);
});
</script>
