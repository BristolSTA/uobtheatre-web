<template>
  <BoxOfficeButton
    class="text-white"
    :class="[
      loading
        ? 'bg-sta-gray-light cursor-not-allowed'
        : checkIn
          ? 'bg-sta-green hover:bg-sta-green-dark'
          : 'bg-sta-orange hover:bg-sta-orange-dark'
    ]"
    @click="onClick"
    ><template v-if="!loading">{{ buttonText }}</template
    ><UiLoadingIcon v-else
  /></BoxOfficeButton>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    checkIn: boolean; // Note that this should be the operation that should happen on click (i.e. if ticket is already checked in, this should be false)
    number?: number;
    asyncAction?: boolean;
  }>(),
  {
    asyncAction: true,
    number: undefined
  }
);

const loading = ref<boolean>(false);

const emit = defineEmits<{
  (event: 'checkIn', asyncCompleteCallback: () => void): void;
  (event: 'unCheckIn', asyncCompleteCallback: () => void): void;
  (event: 'click', asyncCompleteCallback: () => void): void;
}>();

function onClick() {
  if (props.asyncAction) {
    loading.value = true;
  }

  const asyncCompleteCallback = () => {
    loading.value = false;
  };

  emit('click', asyncCompleteCallback);
  props.checkIn
    ? emit('checkIn', asyncCompleteCallback)
    : emit('unCheckIn', asyncCompleteCallback);
}

const buttonText = computed(() => {
  if (props.number) {
    return props.checkIn
      ? `Check In Remaining ${props.number} Tickets`
      : `Un Check In Remaining ${props.number} Tickets`;
  } else {
    return props.checkIn ? 'Check In' : 'Un Check In';
  }
});
</script>
