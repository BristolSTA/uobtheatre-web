<template>
  <div class="h-full text-white bg-sta-gray">
    <div
      v-if="!venue"
      class="justify-center py-20 text-xl font-semibold text-center"
    >
      Loading Venue...
    </div>
    <template v-else>
      <h1 class="container pt-2 text-left text-h1">{{ venue.name }}</h1>
      <div class="flex flex-wrap items-center justify-center mt-2 lg:mb-8">
        <div
          class="flex flex-col items-center w-full px-8 text-justify md:block md:w-auto md:max-w-md"
        >
          {{ venue.description }}
        </div>
        <div class="w-full h-full max-w-xl lg:w-2/3 md:m-4">
          <img
            ref="image"
            class="w-full p-3 md:p-0"
            :src="venue.image.url"
            :alt="`${venue.name} image`"
          />
        </div>
      </div>
      <div class="flex flex-wrap items-center justify-center">
        <div
          class="flex justify-center w-full p-4 space-y-1 lg:w-1/4 lg:order-last lg:mb-0 lg:ml-4 bg-sta-gray-dark"
        >
          <div>
            <h2 class="text-3xl font-semibold text-sta-orange">Venue Info:</h2>
            <table class="table-auto">
              <tbody>
                <tr>
                  <th class="pb-2 pr-2 align-top">Capacity:</th>
                  <td class="align-top">Max {{ venue.internalCapacity }}</td>
                </tr>
                <tr>
                  <th class="pr-2 align-top">Address:</th>
                  <td class="align-top">
                    <div ref="address">
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
            <div class="text-sm font-semibold text-sta-orange">
              <a target="_blank" :href="googleMapsLink">
                <icon-list-item icon="map-marked-alt">
                  Open in Google Maps
                </icon-list-item>
              </a>
            </div>
          </div>
        </div>
        <div
          v-if="venue.address.latitude && venue.address.longitude"
          ref="mapContainer"
          class="flex justify-center w-full lg:w-3/5 h-96 lg:mb-4"
        >
          <div ref="venue-map" class="w-full"></div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import L from 'leaflet';

import IconListItem from '@/components/ui/IconListItem.vue';
import AddressFragment from '@/graphql/fragments/AddressFragment.gql';
import { handle404Mixin } from '@/utils';
import { createClient } from '@/vue-apollo';

export default {
  name: 'VenuePage',
  components: { IconListItem },
  mixins: [IconListItem, handle404Mixin],
  metaInfo() {
    const venueName = this.venue ? this.venue.name : 'Loading...';
    return {
      title: `${venueName}`,
    };
  },
  data() {
    return {
      venue: null,
    };
  },
  beforeRouteEnter(to, from, next) {
    const { apolloClient } = createClient();
    return apolloClient
      .query({
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
          slug: to.params.venueSlug,
        },
      })
      .then((result) => {
        let venue = result.data.venue;
        if (!venue) return next({ name: '404' });
        return next(async (vm) => {
          vm.venue = venue;
          await vm.$nextTick();
          vm.createMap();
        });
      });
  },
  computed: {
    googleMapsLink() {
      return `https://maps.google.com/?q=${this.venue.name},${this.venue.address.street},${this.venue.address.city}`;
    },
  },
  methods: {
    createMap() {
      let venue = this.venue;
      if (!venue.address.latitude || !venue.address.longitude) return;
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
