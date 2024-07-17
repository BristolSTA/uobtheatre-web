<template>
  <div>
    <div
      class="flex md:flex-row gap-2 md:gap-5"
      :class="{ 'flex-col': showIndicator }"
    >
      <div
        class="md:p-5 border-2 border-white text-white flex items-center justify-center flex-grow md:text-4xl overflow-clip md:order-2 text-center"
      >
        {{ state.message ?? 'Waiting...' }}
      </div>

      <div class="flex flex-none rounded-xl md:order-1 gap-5">
        <BoxOfficeScanIndicator
          v-if="showIndicator"
          :state="
            state.success
              ? 'success'
              : state.success === false
                ? 'warning'
                : 'waiting'
          "
          class="h-12 md:h-20 lg:w-64 px-5 flex-grow text-3xl md:text-7xl"
        />
        <button
          v-if="showInformationButton"
          class="text-white py-2 px-6 rounded bg-sta-green"
          @click="emit('click-information')"
        >
          <font-awesome-icon icon="info" />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ICheckInState } from '../../types/box-office';

const props = withDefaults(
  defineProps<{
    state: ICheckInState;
    showInformationButton?: boolean;
    showIndicatorAlways?: boolean;
  }>(),
  {
    showInformationButton: false,
    showIndicatorAlways: true
  }
);

const emit = defineEmits<{
  (event: 'click-information'): void;
}>();

const showIndicator = computed(
  () => props.showIndicatorAlways || props.state.success === false
);
</script>
