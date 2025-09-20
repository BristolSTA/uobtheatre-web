<template>
  <UiBadge class="text-white" :class="colours">
    {{ status }}
  </UiBadge>
</template>

<script setup lang="ts">
import ProductionStatusEnum from '~~/enums/ProductionStatusEnum';
import type { ProductionNode } from '~~/graphql/codegen/operations';

type ProductionProps = Pick<ProductionNode, 'isBookable' | 'status'>;

const props = defineProps<{
  production: ProductionProps;
}>();

const status = computed<string>(() => {
  if (
    !props.production.isBookable &&
    (!props.production.status || props.production.status === 'PUBLISHED')
  ) {
    return 'Not Bookable';
  }
  // Ensure a string is always returned
  return new ProductionStatusEnum(props.production.status).name ?? '';
});

const colours = computed<string>(() => {
  if (['Pending'].includes(status.value)) {
    return 'bg-sta-orange';
  }
  if (['Closed', 'Not Bookable'].includes(status.value)) {
    return 'bg-sta-rouge';
  }
  if (['Published'].includes(status.value)) {
    return 'bg-sta-green';
  }
  if (['Complete'].includes(status.value)) {
    return 'bg-gray-600';
  }
  return 'bg-gray-500';
});
</script>
