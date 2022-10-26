<template>
  <div class="h-full text-white bg-sta-gray">
    <h1 class="container py-6 text-left text-h1">
      {{ venue.name }}
    </h1>
    <div
      class="flex flex-wrap items-center justify-center mt-2 lg:mb-8 lg:px-8"
    >
      <tip-tap-output
        class="px-6 w-full text-justify lg:block lg:px-2 lg:w-1/2"
        :html="venue.description"
      />
      <div
        v-if="venue.image.url"
        class="w-full max-w-2xl h-full md:m-4 lg:w-2/3"
      >
        <img
          ref="image"
          class="p-3 w-full md:p-0"
          :src="venue.image.url"
          :alt="`${venue.name} image`"
        />
      </div>
    </div>
    <div class="flex flex-wrap items-center justify-center">
      <div
        class="flex justify-center p-4 w-full bg-sta-gray-dark lg:order-last lg:ml-4 lg:w-1/4"
      >
        <div>
          <h2 class="text-sta-orange text-3xl font-semibold">Venue Info:</h2>
          <table class="table-auto">
            <tbody>
              <tr>
                <th class="align-top pb-2 pr-2">Capacity:</th>
                <td class="align-top">Max {{ venue.internalCapacity }}</td>
              </tr>
              <tr>
                <th class="align-top pr-2">Address:</th>
                <td class="align-top">
                  <div v-if="venue.address" ref="address">
                    <p v-if="venue.address.buildingName">
                      {{ venue.address.buildingName }}
                    </p>
                    <p>
                      <template v-if="venue.address.buildingNumber">
                        {{ venue.address.buildingNumber }}
                      </template>
                      {{ venue.address.street }}
                    </p>
                    <p>
                      {{ venue.address.city }}, {{ venue.address.postcode }}
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="text-sta-orange text-sm font-semibold">
            <a target="_blank" :href="googleMapsLink">
              <icon-list-item icon="map-marked-alt">
                Open in Google Maps
              </icon-list-item>
            </a>
          </div>
        </div>
      </div>
      <div
        v-if="
          venue.address && venue.address.latitude && venue.address.longitude
        "
        class="flex justify-center w-full h-96 lg:mb-4 lg:w-3/5"
      >
        <div ref="venue-map" class="w-full" />
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import L from 'leaflet';

import IconListItem from '@/components/ui/IconListItem.vue';
import AddressFragment from '@/graphql/fragments/AddressFragment.gql';
import TipTapOutput from '@/components/ui/TipTapOutput.vue';

export default {
  name: 'VenuePage',
  components: { IconListItem, TipTapOutput },
  async asyncData({ params, app, error }) {
    const { data } = await app.apolloProvider.defaultClient.query({
      query: gql`
        query venue($slug: String!) {
          venue(slug: $slug) {
            name
            internalCapacity
            description
            image {
              url
            }
            address {
              ...AddressFields
            }
          }
        }
        ${AddressFragment}
      `,
      variables: {
        slug: params.slug,
      },
    });
    const venue = data.venue;
    if (!venue) {
      return error({
        statusCode: 404,
        message: 'This society does not exists',
      });
    }

    return {
      venue,
    };
  },
  data() {
    return {
      venue: null,
    };
  },
  head() {
    const venueName = this.venue ? this.venue.name : 'Loading...';
    return {
      title: `${venueName}`,
    };
  },
  computed: {
    googleMapsLink() {
      return (
        `https://maps.google.com/?q=${this.venue.name}` +
        (this.venue.address
          ? `,${this.venue.address.street},${this.venue.address.city}`
          : '')
      );
    },
  },
  mounted() {
    this.createMap();
  },
  methods: {
    createMap() {
      const venue = this.venue;
      if (!venue?.address?.latitude || !venue?.address?.longitude) {
        return;
      }
      const map = L.map(this.$refs['venue-map']).setView(
        [venue.address.latitude, venue.address.longitude],
        14
      );
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.popup({ closeButton: false })
        .setLatLng(L.latLng(venue.address.latitude, venue.address.longitude))
        .setContent(`${venue.name}`)
        .openOn(map);
    },
  },
};
</script>
