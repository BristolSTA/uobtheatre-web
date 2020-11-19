<template>
  <div class="text-white container my-6">
    <ul class="uppercase text-xl">
      <li class="font-semibold inline-block hover:text-sta-rouge">
        <clickable-link @click="overview = true">Overview</clickable-link>
      </li>
      <li class="font-semibold inline-block hover:text-sta-rouge ml-6">
        <clickable-link @click="overview = false"
          >Cast & Credits</clickable-link
        >
      </li>
    </ul>
    <div v-if="overview">Overview here</div>
    <div v-else>Cast and credits here</div>
  </div>
</template>

<script>
import ClickableLink from '@/components/ui/ClickableLink.vue';
export default {
  name: 'production-cast-and-credits',
  components: { ClickableLink },
  props: {
    production: {
      required: true,
    },
  },
  data() {
    return {
      overview: true,
    };
  },
};
</script>