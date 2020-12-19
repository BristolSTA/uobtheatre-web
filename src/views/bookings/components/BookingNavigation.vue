<template>
  <nav class="flex flex-col space-y-4">
    <router-link
      v-for="(stage, index) in stages"
      tag="button"
      :key="index"
      :class="stylesForButton(index)"
      class="btn block text-center"
      :to="{ name: stage.getRouteName() }"
      :disabled="stylesForButton(index).includes('disabled')"
    >
      {{ stage.name }}
    </router-link>
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
  },
  data() {
    return {
      stages: Stages,
    };
  },
  methods: {
    stylesForButton(stageIndex) {
      if (this.currentStageIndex == stageIndex) return 'btn-green';
      if (this.currentStageIndex > stageIndex) return 'btn-orange';
      return 'btn-gray-light disabled';
    },
  },
};
</script>