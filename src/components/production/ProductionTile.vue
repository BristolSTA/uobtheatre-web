<template>
  <div class="px-4 cursor-pointer production-tile sm:px-0">
    <router-link
      :to="{ name: 'production', params: { productionSlug: production.slug } }"
    >
      <img
        class="max-w-full"
        src="https://via.placeholder.com/1920x960"
        alt="show poster"
      />
      <h2
        class="text-2xl font-semibold transition-color text-sta-orange production-title"
      >
        {{ production.name }}
      </h2>
      <h2 class="text-2xl transition-colors">
        {{ displayStartEnd(production.start, production.end, 'd MMM') }}
      </h2>
    </router-link>
  </div>
</template>

<script>
import { displayStartEnd } from '@/utils';
export default {
  props: {
    production: {
      required: true,
      type: Object,
    },
  },
  methods: {
    displayStartEnd,
  },
};
</script>

<style scoped lang="scss">
.production-tile:hover {
  @apply text-sta-green;
  .production-title {
    @apply text-sta-green;
  }
}
</style>