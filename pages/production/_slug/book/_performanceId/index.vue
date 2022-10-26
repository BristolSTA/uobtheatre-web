<template>
  <div />
</template>

<script>
import stages from '../-bookingStages';
export default {
  beforeRouteEnter(to, _, next) {
    next({
      name: stages[1].stageInfo.routeName,
      hash: '#booking-view',
      params: {
        slug: to.params.slug,
        performanceId: to.params.performanceId,
      },
    });
  },
};
</script>
