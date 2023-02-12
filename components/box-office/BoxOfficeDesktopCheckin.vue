<template>
  <div>
    <div class="flex flex-col md:flex-row gap-2 md:gap-5">
      <div
        class="md:p-5 border-2 border-white text-white flex items-center justify-center flex-grow md:text-4xl overflow-clip md:order-2"
      >
        {{ state.message ?? 'Waiting...' }}
      </div>

      <div class="flex flex-none rounded-xl md:order-1 gap-5">
        <BoxOfficeScanIndicator
          v-if="showIndicatorAlways || !state.success"
          :state="
            state.success
              ? 'success'
              : state.success === false
              ? 'warning'
              : 'waiting'
          "
          class="h-12 md:h-28 lg:w-64 px-5 flex-grow text-3xl md:text-7xl"
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
import { ICheckInState } from './BoxOfficeSharedTypes';

withDefaults(
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
</script>
