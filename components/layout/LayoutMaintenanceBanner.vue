<template>
  <div
    v-if="!maintenanceBannerDismissed && !loading"
    class="antialiased bg-sta-gray-light"
  >
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
      <div class="max-w-6xl min-w-2/3 xl:min-w-1/2">
        <!-- Main Information Slot -->
        <h3 class="text-h3 md:text-h2">{{ typeConfig.titleText }}</h3>
        <p class="pb-2">
          {{ siteMessages.message }}
        </p>
        <div class="pb-2">
          <span class="font-semibold">Date: </span>
          <span>{{
            dateFormatLocale(siteMessages.eventStart, {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })
          }}</span>
        </div>
        <div class="pb-2">
          <span class="font-semibold">Time: </span>
          <span>{{
            dateFormatLocale(siteMessages.eventStart, {
              hour: 'numeric',
              minute: 'numeric',
              timeZoneName: 'short'
            })
          }}</span>
        </div>
        <div class="pb-2">
          <p>
            <strong>Duration: </strong>
            {{
              humanizeDuration(siteMessages.eventDuration * 60 * 1000, {
                units: ['d', 'h', 'm']
              })
            }}
          </p>
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
import { UpcomingSiteMessagesDocument } from '~/graphql/codegen/operations';
import humanizeDuration from 'humanize-duration';

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
  INFORMATION: {
    accentBar: 'bg-sta-orange-dark',
    iconColour: 'text-sta-orange-dark',
    icon: 'circle-info',
    titleText: 'Important Site Information'
  },
  ALERT: {
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
      type: 'INFORMATION',
      preventDismiss: false,
      loading: true,
      siteMessages: null
    };
  },
  computed: {
    typeConfig() {
      return typeMap[this.siteMessages.type] || {};
    }
  },
  mounted() {
    // Need to store the alert's id in the cookie to check if it's been superceded
    this.maintenanceBannerDismissed =
      cookie.get('maintenanceBannerDismissed') === 'true';
    this.loadSiteMessageData();
  },
  methods: {
    async loadSiteMessageData() {
      this.loading = true;

      const { data } = await this.$apollo.query({
        query: UpcomingSiteMessagesDocument
      });

      console.log(data);

      const siteMessagesData = data.siteMessages;
      if (siteMessagesData) {
        this.siteMessages = siteMessagesData.edges
          .map((edge) => edge.node)
          .filter((node) => {
            return node.activeDisplay;
          })[0];
        console.log(this.siteMessages);
      }

      this.loading = false;
    },
    // Set the cookie for the duration of the maintenance event (EventEnd - Today)
    dismissBanner() {
      this.maintenanceBannerDismissed = true;
      const dismissalTime = this.siteMessages.eventEnd - Date.now();
      cookie.set('maintenanceBannerDismissed', 'true', {
        expires: dismissalTime
      });
    },
    humanizeDuration
  }
};
</script>
