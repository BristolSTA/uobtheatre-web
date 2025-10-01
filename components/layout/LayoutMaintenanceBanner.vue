<template>
  <div v-if="siteMessages.length" class="antialiased bg-sta-gray-light">
    <div class="h-2" :class="[typeConfigFor(currentMessage).accentBar]" />
    <div
      class="flex relative gap-2 p-2 items-start justify-center text-white min-h-24"
    >
      <div class="absolute top-0 left-0 h-full w-4 sm:w-12 md:w-24 lg:w-32">
        <UiStaButton
          v-if="siteMessages.length > 1 && currentIndex > 0"
          class="w-full h-full text-h4 sm:text-4xl transition-colors duration-300 cursor-pointer hover:bg-black/30 focus:outline-hidden -mx-2 sm:m-0"
          icon="chevron-left"
          @click="prevMessage"
        />
      </div>
      <div>
        <!-- Icon Slot -->
        <font-awesome-icon
          class="rounded-sm text-h2 p-2"
          :class="[typeConfigFor(currentMessage).iconColour]"
          :icon="typeConfigFor(currentMessage).icon"
        />
      </div>
      <div class="w-3/4">
        <!-- Main Information Slot -->
        <h3 class="text-h3 md:text-h2 flex items-baseline gap-2">
          <span v-if="currentMessage?.title">{{ currentMessage.title }}</span>
          <span v-else>{{ typeConfigFor(currentMessage).titleText }}</span>
          <span
            v-if="siteMessages.length > 1"
            class="text-sm text-sta-gray-light"
            >{{ currentIndex + 1 }} of {{ siteMessages.length }}</span
          >
        </h3>
        <p class="pb-2 md:text-lg">
          <UiTipTapOutput :html="currentMessage?.message" />
        </p>
        <div class="pb-2">
          <strong
            >{{ isOngoingFor(currentMessage) ? 'Started On' : 'Starting On' }}:
          </strong>
          <span>{{
            dateFormatLocale(currentMessage.eventStart, {
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
          <span v-if="!currentMessage.indefiniteOverride">
            <strong>Expected Duration:</strong>
            {{
              humanizeDuration(
                (currentMessage.eventDuration || 0) * 60 * 1000,
                {
                  units: ['d', 'h', 'm']
                }
              )
            }}
          </span>
          <span v-else> <strong>Duration: </strong>Ongoing</span>
        </div>
      </div>
      <!-- Dismiss Button -->
      <UiStaButton
        v-if="currentMessage && currentMessage.dismissalPolicy !== 'BANNED'"
        class="text-h2 -my-2 cursor-pointer"
        :class="['hover:' + typeConfigFor(currentMessage).iconColour]"
        icon="circle-xmark"
        @click="dismissCurrent"
      />
      <div class="absolute top-0 right-0 h-full w-4 sm:w-12 md:w-24 lg:w-32">
        <UiStaButton
          v-if="
            siteMessages.length > 1 && currentIndex < siteMessages.length - 1
          "
          class="w-full h-full text-h4 sm:text-4xl transition-colors duration-300 cursor-pointer hover:bg-black/30 focus:outline-hidden -mx-4 sm:mx-0"
          icon="chevron-right"
          @click="nextMessage"
        />
      </div>
    </div>
    <div class="h-2" :class="[typeConfigFor(currentMessage).accentBar]" />
  </div>
</template>

<script>
import { UpcomingSiteMessagesDocument } from '~/graphql/codegen/operations';
import humanizeDuration from 'humanize-duration';
import {
  addDismissedId,
  buildTypeKey,
  filterAndSortMessages,
  getDismissedIds,
  isOngoing
} from '@/composables/useSiteMessages';

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
      siteMessages: [],
      currentIndex: 0,
      dismissedIds: [],
      typeMap: typeMap
    };
  },
  computed: {
    currentMessage() {
      return this.siteMessages[this.currentIndex] || null;
    }
  },
  mounted() {
    // Read unified dismissed ids cookie
    this.dismissedIds = getDismissedIds();
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
        const nodes = siteMessages.edges.map((edge) => edge.node);
        this.siteMessages = filterAndSortMessages(nodes, this.dismissedIds);
      }
    },
    nextMessage() {
      if (this.currentIndex < this.siteMessages.length - 1) {
        this.currentIndex += 1;
      }
    },
    prevMessage() {
      if (this.currentIndex > 0) {
        this.currentIndex -= 1;
      }
    },
    dismissCurrent() {
      const msg = this.currentMessage;
      if (!msg) return;
      this.dismissedIds = addDismissedId(
        this.dismissedIds,
        msg.id,
        msg.dismissalPolicy,
        msg.eventEnd
      );
      this.siteMessages.splice(this.currentIndex, 1);
      if (this.siteMessages.length === 0) return;
      if (this.currentIndex >= this.siteMessages.length) {
        this.currentIndex = this.siteMessages.length - 1;
      }
    },
    typeConfigFor(msg) {
      return (
        this.typeMap[buildTypeKey(msg)] || this.typeMap.upcomingInformation
      );
    },
    isOngoingFor(msg) {
      return isOngoing(msg);
    },
    humanizeDuration
  }
};
</script>
