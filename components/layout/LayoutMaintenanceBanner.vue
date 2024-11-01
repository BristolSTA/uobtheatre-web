<template>
  <div
    v-if="siteMessage && !loading && !maintenanceBannerDismissed"
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
          {{ siteMessage.message }}
        </p>
        <div class="pb-2">
          <span class="font-semibold">Date: </span>
          <span>{{
            dateFormatLocale(siteMessage.eventStart, {
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
            dateFormatLocale(siteMessage.eventStart, {
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
              humanizeDuration(siteMessage.eventDuration * 60 * 1000, {
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
      siteMessage: null,
      dismissedIds: []
    };
  },
  computed: {
    typeConfig() {
      return typeMap[this.siteMessage.type] || {};
    }
  },
  mounted() {
    // Need to store the alert's id in the cookie to check if it's been superceded
    this.dismissedIds = cookie.get('maintenanceBannerDismissed')
      ? cookie.get('maintenanceBannerDismissed').split(',')
      : [];
    this.loadSiteMessageData();
  },
  methods: {
    async loadSiteMessageData() {
      this.loading = true;

      const { data } = await this.$apollo.query({
        query: UpcomingSiteMessagesDocument
      });

      console.log(data);

      const siteMessages = data.siteMessages;
      if (siteMessages) {
        this.siteMessage = siteMessages.edges
          .map((edge) => edge.node)
          .filter((node) => {
            return node.toDisplay && !this.dismissedIds.includes(node.id);
          })[0];
      }

      this.loading = false;
    },
    dismissBanner() {
      this.maintenanceBannerDismissed = true;
      const dismissalTime = this.siteMessage.eventEnd - Date.now();

      // If a cookie has already been sent, append the new id to the list
      if (this.dismissedIds) {
        this.dismissedIds.push(this.siteMessage.id);
        cookie.set('maintenanceBannerDismissed', dismissedIds.join(','), {
          expires: dismissalTime
        });
      } else {
        cookie.set('maintenanceBannerDismissed', this.siteMessage.id, {
          expires: dismissalTime
        });
      }
    },
    humanizeDuration
  }
};
</script>
