<template>
  <div>{{ society.name }}</div>
</template>

<script>
import { societyService } from '@/services';
import { handle404Mixin, runPromiseWithLoading } from '@/utils';

export default {
  name: 'scoiety-page',
  mixins: handle404Mixin,

  metaInfo() {
    const societyName = this.scoeity ? this.scoeity.name : 'Loading...';
    return {
      title: `${societyName}`,
    };
  },
  data() {
    return {
      society: null,
    };
  },
  created() {
    runPromiseWithLoading(
      societyService
        .fetchSocietyBySlug(this.$route.params.societySlug)
        .then((data) => (this.society = data))
        .catch(this.handle404)
    );
  },
};
</script>
