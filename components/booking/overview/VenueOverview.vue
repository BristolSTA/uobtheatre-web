<template>
  <overview-box>
    <template #title>
      <font-awesome-icon icon="building" class="mr-2" />
      Venue
    </template>
    <template #subtitle>
      <loading-icon v-if="!venue" />
      <NuxtLink
        v-else
        :to="`/venue/${venue.slug}`"
        target="_blank"
        title="Opens in a new tab"
      >
        <icon-list-item icon="link">{{ venue.name }}</icon-list-item>
      </NuxtLink>
    </template>
    <div v-if="venue">
      <template v-if="venue.address">
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
      </template>
      <div v-if="online" class="mt-2 p-2 bg-sta-gray rounded">
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

import LoadingIcon from '@/components/ui/LoadingIcon.vue'
import IconListItem from '../../ui/IconListItem.vue'
import OverviewBox from '../../ui/Card.vue'

export default {
  name: 'VenueOverview',
  components: { OverviewBox, IconListItem, LoadingIcon },
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
