<template>
  <overview-box>
    <template #title>
      <font-awesome-icon icon="building" class="mr-2" />
      Venue Accessibility
    </template>
    <template #subtitle>
      <loading-icon v-if="!venue" />
      <NuxtLink
        v-else
        :to="`/venue/${venue.slug}`"
        target="_blank"
        title="Opens in a new tab"
      >
        <icon-list-item icon="link">
          {{ venue.name }}
        </icon-list-item>
      </NuxtLink>
    </template>
    <div class="mt-2 text-white">
      <loading-icon v-if="!venue" />
      <p v-else-if="venue.accessibilityInfo">
        {{ venue.accessibilityInfo }}
      </p>
      <p v-else class="font-semibold">
        No accessibility information has been listed for this venue
      </p>
    </div>
  </overview-box>
</template>

<script>
import gql from 'graphql-tag';

import IconListItem from '../ui/UiIconListItem.vue';
import OverviewBox from '../ui/UiCard.vue';
import LoadingIcon from '~~/components/ui/UiLoadingIcon.vue';

import Errors from '~~/classes/Errors';

export default {
  name: 'VenueAccessibility',
  components: { OverviewBox, IconListItem, LoadingIcon },
  props: {
    venueData: {
      requried: true,
      type: [Object, String],
      default: null
    },
    errors: {
      type: Errors,
      default: null
    }
  },
  data() {
    return {
      venue: null
    };
  },
  apollo: {
    venue: {
      query: gql`
        query venue($slug: String!) {
          venue(slug: $slug) {
            name
            slug
            accessibilityInfo
          }
        }
      `,
      variables() {
        return {
          slug: this.venueData
        };
      },
      skip() {
        if (typeof this.venueData !== 'string') {
          this.venue = this.venueData;
          return true;
        }
        return false;
      }
    }
  }
};
</script>
