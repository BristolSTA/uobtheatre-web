<template>
  <div
    class="flex p-2 items-center justify-center"
    :class="stateDefintions[state].backgroundColour"
  >
    <font-awesome-icon :icon="stateDefintions[state].icon" class="text-white" />
  </div>
</template>

<script lang="ts" setup>
type States = 'success' | 'warning' | 'waiting';

defineProps<{
  state: States;
}>();

const stateDefintions: {
  [Property in States]: { icon: string; backgroundColour: string };
} = {
  success: { icon: 'fa-check', backgroundColour: 'bg-green-500' },
  warning: { icon: 'fa-circle-exclamation', backgroundColour: 'bg-sta-orange' },
  waiting: { icon: 'fa-ellipsis', backgroundColour: 'bg-gray-400' }
};
</script>
