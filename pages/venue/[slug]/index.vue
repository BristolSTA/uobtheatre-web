<template>
  <div class="h-full text-white bg-sta-gray">
    <Head>
      <Title>{{ venue?.name ?? 'Loading...' }}</Title>
    </Head>
    <div
      v-if="banner"
      ref="banner"
      class="min-h-25vh 2xl:min-h-40vh bg-cover bg-center"
      :style="{
        'background-image': banner
      }"
    />
    <h1 class="container py-6 text-left text-h1">
      {{ venue.name }}
    </h1>
    <div
      class="flex flex-wrap items-center justify-center mt-2 lg:mb-8 lg:px-8"
    >
      <UiTipTapOutput
        v-if="venue.description"
        class="px-6 w-full text-justify lg:block lg:px-2 lg:w-1/2"
        :html="venue.description"
      />
      <div
        v-if="venue.image.url"
        class="w-full max-w-2xl h-full md:m-4 lg:w-2/3"
      >
        <img
          data-test="image"
          class="p-3 w-full md:p-0"
          :src="venue.image.url"
          :alt="`${venue.name} image`"
        />
      </div>
    </div>
    <div class="flex flex-wrap items-center justify-center">
      <VenueAccessibility :venue-data="venue" />
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
                  <div v-if="venue.address" data-test="address-details">
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
              <UiIconListItem icon="map-marked-alt">
                Open in Google Maps
              </UiIconListItem>
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
        <UiMap
          v-if="venue !== null"
          class="w-full"
          data-test="map"
          @initalised="initMap"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  VenuePageDetailsDocument,
  type VenuePageDetailsQuery,
  type VenuePageDetailsQueryVariables
} from '@/graphql/codegen/operations';
import type { Ref } from 'vue';
import VenuePageDetails from '@/graphql/queries/venue/VenuePageDetails.gql';

import L from 'leaflet';

export default defineNuxtComponent({
  async asyncData() {
    const { data } = await useAsyncQuery({
      query: VenuePageDetails,
      variables: {
        slug: useRoute().params.slug
      }
    });

    const venue = data._rawValue.venue;
    if (!venue) {
      throw createSafeError({
        statusCode: 404,
        message: 'This venue does not exist'
      });
    }

    return {
      venue
    };
  },
  data() {
    return {
      venue: null
    };
  },
  methods: {
    initMap(mapRef) {
      if (!this.venue.address.latitude || !this.venue.address.longitude) return;
      const map = mapRef.value.setView(
        [this.venue.address.latitude, this.venue.address.longitude],
        14
      );
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      L.popup({ closeButton: false })
        .setLatLng(
          L.latLng(this.venue.address.latitude, this.venue.address.longitude)
        )
        .setContent(`${this.venue.name}`)
        .openOn(map);
    }
  },
  computed: {
    banner() {
      return this.venue?.image?.url ? `url("${this.venue.image.url}")` : null;
    },
    googleMapsLink() {
      if (!this.venue.address) return '';
      const address = this.venue.address;
      return (
        `https://maps.google.com/?q=${this.venue.name}` +
        (this.venue.address
          ? `,${this.venue.address.street},${this.venue.address.city}`
          : '')
      );
    }
  }
});
</script>
