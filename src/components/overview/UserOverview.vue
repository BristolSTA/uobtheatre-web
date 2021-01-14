<template>
  <overview-box>
    <template v-slot:title
      ><font-awesome-icon icon="user-edit" class="mr-2" /> Your
      Details</template
    >
    <template v-slot:subtitle> Joe Bloogs </template>
    <div>joe.bloggs@example.org</div>
  </overview-box>
</template>

<script>
import OverviewBox from '@/components/overview/OverviewBox.vue';

export default {
  name: 'user-overview',
  components: { OverviewBox },
  props: {
    user: {
      required: true,
    },
  },
};
</script>
