<template>
  <overview-box>
    <template v-slot:title>
      <font-awesome-icon icon="building" class="mr-2" />
      Venue
    </template>
    <template v-slot:subtitle>
      <font-awesome-icon
        v-if="!venue"
        class="animate-spin"
        icon="circle-notch"
      />
      <router-link
        v-else
        :to="{
          name: 'venue',
          params: { venueSlug: venue.slug },
        }"
        target="_blank"
        title="Opens in a new tab"
      >
        <icon-list-item icon="link">The {{ venue.name }}</icon-list-item>
      </router-link>
    </template>
    <div v-if="venue">
      <p v-if="venue.address.buildingName">
        {{ venue.address.buildingName }}
      </p>
      <p>
        <template v-if="venue.address.buildingNumber">
          {{ venue.address.buildingNumber }}
        </template>
        {{ venue.address.street }}
      </p>
      <p>{{ venue.address.city }}</p>
      <p>{{ venue.address.postcode }}</p>
      <div class="p-2 mt-2 rounded bg-sta-gray" v-if="online">
        <icon-list-item icon="info-circle">
          Online joining information will be sent via email
        </icon-list-item>
      </div>
    </div>
  </overview-box>
</template>

<script>
import gql from 'graphql-tag';

import AddressFragments from '@/graphql/fragments/AddressFragment.gql';
import { handle404Mixin } from '@/utils';

import IconListItem from '../../ui/IconListItem.vue';
import OverviewBox from './OverviewBox.vue';

export default {
  name: 'venue-overview',
  components: { OverviewBox, IconListItem },
  mixins: [handle404Mixin],
  props: {
    venue_data: {
      requried: true,
    },
    online: {
      required: false,
    },
    inPerson: {
      required: false,
    },
  },
  data() {
    return {
      venue: null,
    };
  },
  apollo: {
    venue: {
      query: gql`
        query venue($slug: String!) {
          venue(slug: $slug) {
            name
            slug
            address {
              ...AddressFields
            }
          }
        }
        ${AddressFragments}
      `,
      variables() {
        return {
          slug: this.venue_data,
        };
      },
      skip() {
        if (typeof this.venue_data != 'string') {
          this.venue = this.venue_data;
          return true;
        }
        return false;
      },
    },
  },
};
</script>
