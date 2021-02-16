<template>
  <nav class="flex flex-col space-y-4">
    <button
      v-for="(stage, index) in applicableStages"
      :key="index"
      tag="button"
      :class="stylesForButton(stage)"
      class="block text-center btn"
      :disabled="stylesForButton(stage).includes('disabled')"
      @click="onSelectStage(stage)"
      @keypress="onSelectStage(stage)"
    >
      {{ stage.name }}
    </button>
  </nav>
</template>

<script>
import Stages, { getStageIndex } from '@/views/booking/bookingStages';
export default {
  name: 'BookingNavigation',
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
  computed: {
    applicableStages() {
      return Stages.filter((stage) => {
        return stage.shouldBeUsed(this.production, this.booking);
      });
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
};
</script>
