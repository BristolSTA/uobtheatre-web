<template>
  <UModal
    v-model:open="showModel"
    class="bg-sta-gray max-w-3/4 w-fit"
    :close="false"
    :dismissible="!preventDismiss"
    @after:leave="dismissBanner"
  >
    <template #description>
      <div class="overflow-scroll max-h-[80vh]">
        <div class="flex items-center justify-between mb-2">
          <h1 class="text-xl text-white font-bold">
            {{ siteMessage.title }}
          </h1>
          <UiStaButton
            v-if="!preventDismiss"
            class="text-xl -my-2 text-sta-orange hover:text-sta-orange-dark"
            icon="circle-xmark"
            @click="dismissBanner"
          />
        </div>
        <div class="text-white text-lg">
          <div v-for="(line, index) in formattedMessage" :key="index">
            <p v-if="line.trim() !== ''">{{ line }}</p>
            <br v-else />
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script>
import cookie from 'js-cookie';
import { UpcomingSiteMessagesDocument } from '~/graphql/codegen/operations';
import humanizeDuration from 'humanize-duration';
import { DateTime } from 'luxon';

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
      siteMessage: null,
      dismissedIds: [],
      showModel: false
    };
  },
  computed: {
    isOngoing() {
      return this.siteMessage.eventStart < DateTime.now().toISO();
    },
    formattedMessage() {
      // Split around new lines and trim each line
      // Allows us to show multi-line messages without needing HTML in the message
      // (because that's bad)
      const msg = this.siteMessage?.message || '';
      return msg.split('\n').map((line) => line.trim());
    }
  },
  mounted() {
    // Need to store the alert's id in the cookie to check if it's been superceded
    this.dismissedIds = cookie.get('siteMessageModalDismissed')
      ? cookie.get('siteMessageModalDismissed').split(',')
      : [];
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
        this.siteMessage = siteMessages.edges
          .map((edge) => edge.node)
          .filter((node) => {
            return (
              node.toDisplay && !this.dismissedIds.includes(String(node.id))
            );
          })[0];

        if (this.siteMessage) {
          this.showModel = true;
          if (this.siteMessage.dismissalPolicy === 'BANNED') {
            this.preventDismiss = true;
          }
        }
      }
    },
    dismissBanner() {
      this.showModel = false;

      if (this.siteMessage.dismissalPolicy === 'BANNED') {
        return;
      }

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
