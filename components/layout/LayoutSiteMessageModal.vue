<template>
  <UModal
    v-model:open="showModel"
    class="bg-sta-gray min-w-1/2 max-w-11/12 sm:max-w-3/4"
    :close="false"
    :dismissible="!preventDismiss"
    @after:leave="dismissOnClose"
  >
    <template #content>
      <div class="overflow-auto max-h-[80vh] p-4 sm:px-6">
        <div
          class="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-2 sm:gap-4"
        >
          <div class="flex-1 text-center sm:text-left order-2 sm:order-1">
            <h1 class="text-xl text-white font-bold">
              <span v-if="currentMessage?.title">{{
                currentMessage.title
              }}</span>
              <span v-else>{{ typeConfigFor(currentMessage).titleText }}</span>
            </h1>
            <div
              v-if="messages.length > 1"
              class="text-sta-gray-300 text-sm mt-1"
            >
              {{ currentIndex + 1 }} of {{ messages.length }}
            </div>
          </div>
          <div class="flex items-center order-1 sm:order-2">
            <UiStaButton
              v-if="messages.length > 1"
              :class="[
                'text-xl -my-2 text-sta-orange hover:text-sta-orange-dark cursor-pointer',
                messages.length > 1 && currentIndex > 0 ? '' : 'invisible'
              ]"
              icon="chevron-left"
              :disabled="messages.length <= 1 || currentIndex === 0"
              @click="prevMessage"
            />
            <UiStaButton
              :class="[
                'text-xl -my-2 text-sta-orange hover:text-sta-orange-dark cursor-pointer',
                !preventDismiss ? '' : 'invisible'
              ]"
              icon="circle-xmark"
              :disabled="preventDismiss"
              @click="dismissCurrent"
            />
            <UiStaButton
              v-if="messages.length > 1"
              :class="[
                'text-xl -my-2 text-sta-orange hover:text-sta-orange-dark cursor-pointer',
                messages.length > 1 && currentIndex < messages.length - 1
                  ? ''
                  : 'invisible'
              ]"
              icon="chevron-right"
              :disabled="
                messages.length <= 1 || currentIndex === messages.length - 1
              "
              @click="nextMessage"
            />
          </div>
        </div>
        <div class="text-white text-lg">
          <UiTipTapOutput :html="currentMessage?.message" />
        </div>
        <!-- Go Back Button -->
        <div v-if="showGoBack" class="mt-6 flex justify-center">
          <UiStaButton
            class="btn btn-outline btn-orange font font-semibold"
            @click="goBack"
          >
            Go Back
          </UiStaButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script>
import { UpcomingSiteMessagesDocument } from '~/graphql/codegen/operations';
import {
  addDismissedId,
  filterAndSortMessages,
  getDismissedIds,
  buildTypeKey
} from '@/composables/useSiteMessages';

const typeMap = {
  upcomingMaintenance: {
    titleText: 'Upcoming Maintenance'
  },
  ongoingMaintenance: {
    titleText: 'Ongoing Maintenance'
  },
  upcomingInformation: {
    titleText: 'Important Future Information'
  },
  ongoingInformation: {
    titleText: 'Important Information'
  },
  upcomingAlert: {
    titleText: 'Urgent Future Alert'
  },
  ongoingAlert: {
    titleText: 'Urgent Alert'
  }
};

export default {
  name: 'LayoutSiteMessageModal',
  props: {
    location: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      preventDismiss: false,
      messages: [],
      currentIndex: 0,
      dismissedIds: [],
      showModel: false,
      typeMap: typeMap
    };
  },
  computed: {
    currentMessage() {
      return this.messages[this.currentIndex] || null;
    },
    showGoBack() {
      const msg = this.currentMessage;
      return msg && msg.type !== 'sitewide' && msg.dismissalPolicy === 'BANNED';
    }
  },
  mounted() {
    // Load previously dismissed ids from cookies
    this.dismissedIds = getDismissedIds();
    this.loadSiteMessageData();
  },
  methods: {
    async loadSiteMessageData() {
      const { data } = await this.$apollo.query({
        query: UpcomingSiteMessagesDocument,
        variables: {
          now: new Date(),
          displayLocation: this.location
        }
      });

      const siteMessages = data.siteMessages;
      if (siteMessages) {
        const nodes = siteMessages.edges.map((edge) => edge.node);
        this.messages = filterAndSortMessages(nodes, this.dismissedIds);
        if (this.messages.length) {
          this.showModel = true;
          this.preventDismiss = this.messages[0].dismissalPolicy === 'BANNED';
        }
      }
    },
    nextMessage() {
      if (this.currentIndex < this.messages.length - 1) {
        this.currentIndex += 1;
        this.preventDismiss = this.currentMessage.dismissalPolicy === 'BANNED';
      }
    },
    prevMessage() {
      if (this.currentIndex > 0) {
        this.currentIndex -= 1;
        this.preventDismiss = this.currentMessage.dismissalPolicy === 'BANNED';
      }
    },
    dismissCurrent() {
      const msg = this.currentMessage;
      if (!msg) return;
      this.dismissedIds = addDismissedId(
        msg.id,
        msg.dismissalPolicy,
        msg.eventEnd
      );
      // Remove from queue and update index
      this.messages.splice(this.currentIndex, 1);
      if (this.messages.length === 0) {
        this.showModel = false;
        return;
      }
      // Keep index within bounds
      if (this.currentIndex >= this.messages.length) {
        this.currentIndex = this.messages.length - 1;
      }
      this.preventDismiss = this.currentMessage.dismissalPolicy === 'BANNED';
    },
    dismissOnClose() {
      // Mirror prior behavior: when modal closes, treat as dismiss of current message if allowed
      const msg = this.currentMessage;
      if (!msg) return;
      if (msg.dismissalPolicy === 'BANNED') {
        // If banned, closing shouldn't be possible (dismissible=false), but guard anyway
        return;
      }
      this.dismissCurrent();
    },
    goBack() {
      this.$router.back();
    },
    typeConfigFor(msg) {
      return (
        this.typeMap[buildTypeKey(msg)] || this.typeMap.upcomingInformation
      );
    }
  }
};
</script>
