<template>
  <nav class="flex flex-col space-y-4">
    <button
      v-for="(stage, index) in stages"
      tag="button"
      :key="index"
      :class="stylesForButton(index)"
      class="btn block text-center"
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
import Stages from '../bookingStages';
export default {
  name: 'booking-navigation',
  props: {
    currentStageIndex: {
      required: true,
    },
    maxAllowedStageIndex: {
      required: true,
    },
  },
  data() {
    return {
      stages: Stages,
    };
  },
  methods: {
    stylesForButton(stageIndex) {
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
};
</script>