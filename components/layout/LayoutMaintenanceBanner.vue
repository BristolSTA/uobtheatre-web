<template>
  <div v-if="!maintenanceBannerDismissed" class="antialiased bg-sta-gray-light">
    <div class="bg-sta-rouge-dark h-2" />
    <div class="flex gap-2 p-2 items-start justify-center text-white min-h-24">
      <div>
        <!-- Icon Slot -->
        <font-awesome-icon
          class="text-sta-rouge-dark rounded text-h2 p-2"
          icon="circle-exclamation"
        />
      </div>
      <div class="max-w-6xl">
        <!-- Main Information Slot -->
        <h3 class="text-h3 md:text-h2">Site Maintenance</h3>
        <p class="pb-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in
          facilisis mauris. Fusce enim purus, bibendum sit amet neque sit amet,
          molestie aliquam felis. Cras dictum ante eu ex egestas luctus. Fusce
          quis massa id ex ultricies aliquet in at erat.
        </p>
        <div class="pb-2">
          <span class="font-semibold">Date: </span>
          <span>Now</span>
        </div>
        <div class="pb-2">
          <span class="font-semibold">Time: </span>
          <span>Now</span>
        </div>
        <div class="pb-2">
          <span class="font-semibold">Duration: </span>
          <span>Forever</span>
        </div>
      </div>
      <div>
        <!-- Icon Slot -->
        <UiStaButton
          class="text-h2 hover:text-sta-rouge-dark -my-2"
          icon="circle-xmark"
          @click="dismissBanner"
        />
      </div>
    </div>
    <div class="bg-sta-rouge-dark h-2" />
  </div>
</template>

<script>
import cookie from 'js-cookie';

export default {
  name: 'LayoutMaintenanceBanner',
  data() {
    return {
      maintenanceBannerDismissed: false
    };
  },
  mounted() {
    console.log('mounted');
    this.maintenanceBannerDismissed =
      cookie.get('maintenanceBannerDismissed') === 'true';
  },
  methods: {
    dismissBanner() {
      this.maintenanceBannerDismissed = true;
      cookie.set('maintenanceBannerDismissed', 'true', { expires: 1 });
    }
  }
};
</script>
