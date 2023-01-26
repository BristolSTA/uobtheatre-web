<template>
  <div>
    <div class="gap-5 flex flex-none bg-sta-gray-dark rounded-xl p-5">
      <BoxOfficeScanIndicator
        :state="
          state.success
            ? 'success'
            : state.success === false
            ? 'warning'
            : 'waiting'
        "
        class="h-28 w-4/12 flex-none text-7xl"
      />
      <div
        class="p-5 border-2 border-white text-white flex items-center justify-center flex-grow text-4xl overflow-clip"
      >
        {{ state.message ?? 'Waiting...' }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ICheckInIndicator } from './BoxOfficeSharedTypes';

defineProps<{
  state: ICheckInIndicator;
}>();
</script>
