<template>
  <div v-if="!maintenanceBannerDismissed" class="antialiased bg-sta-gray-light">
    <div class="h-2" :class="[typeConfig.accentBar]" />
    <div class="flex gap-2 p-2 items-start justify-center text-white min-h-24">
      <div>
        <!-- Icon Slot -->
        <font-awesome-icon
          class="rounded text-h2 p-2"
          :class="[typeConfig.iconColour]"
          :icon="typeConfig.icon"
        />
      </div>
      <div class="max-w-6xl">
        <!-- Main Information Slot -->
        <h3 class="text-h3 md:text-h2">{{ typeConfig.titleText }}</h3>
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
          <p><strong>Duration: </strong>Forever</p>
        </div>
      </div>
      <div>
        <!-- Icon Slot -->
        <UiStaButton
          class="text-h2 -my-2"
          :class="['hover:' + typeConfig.iconColour]"
          icon="circle-xmark"
          :disabled="preventDismiss"
          @click="dismissBanner"
        />
      </div>
    </div>
    <div class="h-2" :class="[typeConfig.accentBar]" />
  </div>
</template>

<script>
import cookie from 'js-cookie';

const typeMap = {
  upcomingMaintenance: {
    accentBar: 'bg-sta-orange-dark',
    iconColour: 'text-sta-orange-dark',
    icon: 'triangle-exclamation',
    titleText: 'Upcoming Site Maintenance'
  },
  ongoingMaintenance: {
    accentBar: 'bg-sta-rouge-dark',
    iconColour: 'text-sta-rouge-dark',
    icon: 'circle-exclamation',
    titleText: 'Ongoing Site Maintenance'
  },
  information: {
    accentBar: 'bg-sta-orange-dark',
    iconColour: 'text-sta-orange-dark',
    icon: 'circle-info',
    titleText: 'Important Site Information'
  },
  alert: {
    accentBar: 'bg-sta-rouge-dark',
    iconColour: 'text-sta-rouge-dark',
    icon: 'circle-exclamation',
    titleText: 'Urgent Site Alert'
  }
};

export default {
  name: 'LayoutMaintenanceBanner',
  data() {
    return {
      maintenanceBannerDismissed: false,
      type: 'information',
      preventDismiss: false
    };
  },
  computed: {
    typeConfig() {
      return typeMap[this.type] || {};
    }
  },
  mounted() {
    // Need to store the alert's id in the cookie to check if it's been superceded
    this.maintenanceBannerDismissed =
      cookie.get('maintenanceBannerDismissed') === 'true';
  },
  methods: {
    // Set the cookie for the duration of the maintenance event (EventEnd - Today)
    dismissBanner() {
      this.maintenanceBannerDismissed = true;
      cookie.set('maintenanceBannerDismissed', 'true', { expires: 1 });
    }
  }
};
</script>
