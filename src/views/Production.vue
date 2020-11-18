<template>
  <div>
    {{ production ? production.name : 'Loading...' }}
  </div>
</template>

<script>
import { productionService } from '@/services';
export default {
  name: 'production',
  data() {
    return {
      production: null,
    };
  },
  created() {
    productionService
      .fetchProductionBySlug(this.$route.params.productionSlug)
      .then((data) => (this.production = data));
  },
};
</script>