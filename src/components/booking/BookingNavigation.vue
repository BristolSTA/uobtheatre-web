<template>
  <nav class="flex flex-col space-y-4">
    <button
      v-for="(stage, index) in applicableStages"
      tag="button"
      :key="index"
      :class="stylesForButton(stage)"
      class="block text-center btn"
      @click="onSelectStage(stage)"
      @keyup="onSelectStage(stage)"
    >
      <!-- 
      :disabled="stylesForButton(index).includes('disabled')" -->
      {{ stage.name }}
    </button>
  </nav>
</template>

<script>
import Stages, { getStageIndex } from '@/views/booking/bookingStages';
export default {
  name: 'booking-navigation',
  props: {
    currentStageIndex: {
      required: true,
    },
    maxAllowedStageIndex: {
      required: true,
    },
    production: {
      required: true,
    },
    booking: {
      required: true,
    },
  },
  methods: {
    stylesForButton(stage) {
      let stageIndex = getStageIndex(stage);
      if (this.currentStageIndex == stageIndex) return 'btn-orange';
      if (
        this.currentStageIndex > stageIndex ||
        stageIndex <= this.maxAllowedStageIndex
      )
        return 'btn-green';
      return 'btn-gray-light '; //disabled
    },
    onSelectStage(stage) {
      this.$emit('goto-stage', stage);
    },
  },
  computed: {
    applicableStages() {
      return Stages.filter((stage) => {
        return stage.shouldBeUsed(this.production, this.booking);
      });
    },
  },
};
</script>