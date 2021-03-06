<template>
  <overview-box>
    <template #title>
      <font-awesome-icon icon="building" class="mr-2" />
      Venue
    </template>
    <template #subtitle>
      <font-awesome-icon
        v-if="!venue"
        class="animate-spin"
        icon="circle-notch"
      />
      <NuxtLink
        v-else
        :to="`/venue/${venue.slug}`"
        target="_blank"
        title="Opens in a new tab"
      >
        <icon-list-item icon="link">The {{ venue.name }}</icon-list-item>
      </NuxtLink>
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
      <div v-if="online" class="p-2 mt-2 rounded bg-sta-gray">
        <icon-list-item icon="info-circle">
          Online joining information will be sent via email
        </icon-list-item>
      </div>
    </div>
  </overview-box>
</template>

<script>
import gql from 'graphql-tag'

import AddressFragments from '@/graphql/fragments/AddressFragment.gql'

import IconListItem from '../../ui/IconListItem.vue'
import OverviewBox from './OverviewBox.vue'

export default {
  name: 'VenueOverview',
  components: { OverviewBox, IconListItem },
  props: {
    venueData: {
      requried: true,
      type: [Object, String],
      default: null,
    },
    online: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      venue: null,
    }
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
          slug: this.venueData,
        }
      },
      skip() {
        if (typeof this.venueData !== 'string') {
          this.venue = this.venueData
          return true
        }
        return false
      },
    },
  },
}
</script>
