<template>
  <overview-box>
    <template v-slot:title
      ><font-awesome-icon icon="user-edit" class="mr-2" /> Your
      Details</template
    >
    <template v-slot:subtitle
      >{{ $store.state.auth.user.firstName }}
      {{ $store.state.auth.user.lastName }}</template
    >
    <div>{{ $store.state.auth.user.email }}</div>
  </overview-box>
</template>

<script>
import OverviewBox from './OverviewBox.vue';

export default {
  name: 'user-overview',
  components: { OverviewBox },
};
</script>
