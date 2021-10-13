<template>
  <nav class="flex flex-col space-y-4">
    <button
      v-for="(stageComponent, index) in applicableStages"
      :key="index"
      tag="button"
      :class="stylesForButton(stageComponent.stageInfo)"
      class="btn block text-center"
      :disabled="stylesForButton(stageComponent.stageInfo).includes('disabled')"
      @click="onSelectStage(stageComponent)"
      @keypress="onSelectStage(stageComponent)"
    >
      {{ stageComponent.stageInfo.name }}
    </button>
  </nav>
</template>

<script>
import Booking from '@/classes/Booking'
import Stages, {
  getStageIndex,
} from '@/pages/production/_slug/book/-bookingStages'
export default {
  name: 'BookingNavigation',
  props: {
    currentStageIndex: {
      required: true,
      type: Number,
    },
    production: {
      required: true,
      type: Object,
    },
    booking: {
      required: true,
      type: Booking,
    },
  },
  computed: {
    applicableStages() {
      return Stages.filter((stageComponent) => {
        return stageComponent.stageInfo.shouldBeUsed(
          this.production,
          this.booking
        )
      })
    },
  },
  methods: {
    stylesForButton(stage) {
      const stageIndex = getStageIndex(stage)
      if (this.currentStageIndex === stageIndex) return 'btn-orange'
      if (
        this.currentStageIndex > stageIndex &&
        stage.eligable(this.production, this.booking)
      )
        return 'btn-green'
      return 'btn-gray-light disabled'
    },
    onSelectStage(stage) {
      if (getStageIndex(stage.stageInfo) === this.currentStageIndex) return
      this.$emit('goto-stage', stage)
    },
  },
}
</script>
