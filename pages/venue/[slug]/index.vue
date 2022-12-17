<template>
  <div class="h-full text-white bg-sta-gray">
    <Head>
      <Title>{{ venue.name }}</Title>
    </Head>
    <h1 class="container py-6 text-left text-h1">
      {{ venue.name }}
    </h1>
    <div
      class="flex flex-wrap items-center justify-center mt-2 lg:mb-8 lg:px-8"
    >
      <UiTipTapOutput
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
        <UiMap class="w-full" @initalised="initMap" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  VenuePageDetailsDocument,
  VenuePageDetailsQuery,
  VenuePageDetailsQueryVariables
} from '@/graphql/codegen/operations';
import { Ref } from 'vue';

import L from 'leaflet';

const { data } = await useAsyncQuery<VenuePageDetailsQuery>(
  VenuePageDetailsDocument,
  { slug: useRoute().params.slug } as VenuePageDetailsQueryVariables
);

if (!data.value?.venue)
  throw createError({
    statusCode: 404,
    message: 'This venue does not exist'
  });

const venue = data.value.venue;

const googleMapsLink = computed(
  () =>
    `https://maps.google.com/?q=${venue.name}` +
    (venue.address ? `,${venue.address.street},${venue.address.city}` : '')
);

function initMap(mapRef: Ref<L.Map>) {
  if (!venue.address.latitude || !venue.address.longitude) return;
  const map = mapRef.value.setView(
    [venue.address.latitude, venue.address.longitude],
    14
  );
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  L.popup({ closeButton: false })
    .setLatLng(L.latLng(venue.address.latitude, venue.address.longitude))
    .setContent(`${venue.name}`)
    .openOn(map);
}
</script>
