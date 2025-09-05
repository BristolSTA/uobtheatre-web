<template>
  <div
    v-if="siteMessage && !maintenanceBannerDismissed"
    class="antialiased bg-sta-gray-light"
  >
    <div class="h-2" :class="[typeConfig.accentBar]" />
    <div class="flex gap-2 p-2 items-start justify-center text-white min-h-24">
      <div>
        <!-- Icon Slot -->
        <font-awesome-icon
          id="maintenanceBannerIcon"
          class="rounded-sm text-h2 p-2"
          :class="[typeConfig.iconColour]"
          :icon="typeConfig.icon"
        />
      </div>
      <div class="max-w-6xl min-w-2/3 xl:min-w-1/2">
        <!-- Main Information Slot -->
        <h3 class="text-h3 md:text-h2">{{ typeConfig.titleText }}</h3>
        <p class="pb-2 md:text-lg">
          {{ siteMessage.message }}
        </p>
        <div class="pb-2">
          <strong>{{ isOngoing ? 'Started On' : 'Starting On' }}: </strong>
          <span>{{
            dateFormatLocale(siteMessage.eventStart, {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              timeZoneName: 'short'
            })
          }}</span>
        </div>
        <div class="pb-2">
          <span v-if="!siteMessage.indefiniteOverride">
            <strong>Expected Duration:</strong>
            {{
              humanizeDuration(siteMessage.eventDuration * 60 * 1000, {
                units: ['d', 'h', 'm']
              })
            }}
          </span>
          <span v-else> <strong>Duration: </strong>Ongoing</span>
        </div>
      </div>
      <div>
        <!-- Icon Slot -->
        <UiStaButton
          id="maintenanceBannerDismiss"
          class="text-h2 -my-2 hover:text-sta-rouge-dark"
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
import { DateTime } from 'luxon';

const typeMap = {
  upcomingMaintenance: {
    accentBar: 'bg-sta-orange-dark',
    iconColour: 'text-sta-orange-dark',
    icon: 'triangle-exclamation',
    titleText: 'Upcoming Maintenance'
  },
  ongoingMaintenance: {
    accentBar: 'bg-sta-rouge-dark',
    iconColour: 'text-sta-rouge-dark',
    icon: 'circle-exclamation',
    titleText: 'Ongoing Maintenance'
  },
  upcomingInformation: {
    accentBar: 'bg-sta-orange-dark',
    iconColour: 'text-sta-orange-dark',
    icon: 'circle-info',
    titleText: 'Important Future Information'
  },
  ongoingInformation: {
    accentBar: 'bg-sta-orange-dark',
    iconColour: 'text-sta-orange-dark',
    icon: 'circle-info',
    titleText: 'Important Information'
  },
  upcomingAlert: {
    accentBar: 'bg-sta-rouge-dark',
    iconColour: 'text-sta-rouge-dark',
    icon: 'circle-exclamation',
    titleText: 'Urgent Future Alert'
  },
  ongoingAlert: {
    accentBar: 'bg-sta-rouge-dark',
    iconColour: 'text-sta-rouge-dark',
    icon: 'circle-exclamation',
    titleText: 'Urgent Alert'
  }
};

export default {
  name: 'LayoutMaintenanceBanner',
  data() {
    return {
      maintenanceBannerDismissed: false,
      preventDismiss: false,
      siteMessage: null,
      dismissedIds: [],
      typeMap: typeMap
    };
  },
  computed: {
    isOngoing() {
      return this.siteMessage.eventStart < DateTime.now().toISO();
    },
    typeConfig() {
      // Combine type and if its ongoing (e.g. ongoingMaintenance, upcomingAlert)
      return typeMap[
        `${this.isOngoing ? 'ongoing' : 'upcoming'}${this.siteMessage.type.charAt(0)}${this.siteMessage.type.slice(1).toLowerCase()}`
      ];
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
      const { data } = await this.$apollo.query({
        query: UpcomingSiteMessagesDocument,
        variables: {
          now: new Date(),
          displayLocation: 'BANNER'
        }
      });

      const siteMessages = data.siteMessages;
      if (siteMessages) {
        this.siteMessage = siteMessages.edges
          .map((edge) => edge.node)
          .filter((node) => {
            return (
              node.toDisplay && !this.dismissedIds.includes(String(node.id))
            );
          })[0];

        if (this.siteMessage && this.siteMessage.dismissalPolicy === 'BANNED') {
          this.preventDismiss = true;
        }
      }
    },
    dismissBanner() {
      this.maintenanceBannerDismissed = true;

      if (this.siteMessage.dismissalPolicy === 'SINGLE') {
        // Session cookies are deleted when the browser is closed, so no need to set an expiry
        // If a cookie has already been sent, append the new id to the list, otherwise create the cookie
        if (this.dismissedIds) {
          this.dismissedIds.push(this.siteMessage.id);
          cookie.set('siteMessageModalDismissed', this.dismissedIds.join(','));
        } else {
          cookie.set('siteMessageModalDismissed', this.siteMessage.id);
        }
        return;
      }

      const dismissalTime = new Date(this.siteMessage.eventEnd);

      // If a cookie has already been sent, append the new id to the list, otherwise create the cookie
      if (this.dismissedIds) {
        this.dismissedIds.push(this.siteMessage.id);
        cookie.set('siteMessageModalDismissed', this.dismissedIds.join(','), {
          expires: dismissalTime
        });
      } else {
        cookie.set('siteMessageModalDismissed', this.siteMessage.id, {
          expires: dismissalTime
        });
      }
    },
    humanizeDuration
  }
};
</script>
