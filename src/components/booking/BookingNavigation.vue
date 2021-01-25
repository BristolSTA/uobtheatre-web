<template>
  <nav class="flex flex-col space-y-4">
    <button
      v-for="(stage, index) in applicableStages"
      tag="button"
      :key="index"
      :class="stylesForButton(stage)"
      class="block text-center btn"
      @click="onSelectStage(stage)"
      @keypress="onSelectStage(stage)"
      :disabled="stylesForButton(stage).includes('disabled')"
    >
      {{ stage.name }}
    </button>
  </nav>
</template>

<script>
// TODO: Fix mobile navigation here
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
        (this.currentStageIndex > stageIndex ||
          stageIndex <= this.maxAllowedStageIndex) &&
        stage.eligable(this.production, this.booking)
      )
        return 'btn-green';
      return 'btn-gray-light disabled';
    },
    onSelectStage(stage) {
      if (getStageIndex(stage) == this.currentStageIndex) return;
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
