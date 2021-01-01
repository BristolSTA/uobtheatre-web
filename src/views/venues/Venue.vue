<template>
  <div class="h-full text-white bg-sta-gray">
    <div
      v-if="!venue"
      class="justify-center py-20 text-xl font-semibold text-center"
    >
      Loading Venue...
    </div>
    <template v-else>
      <h1 class="pt-4 ml-10 text-left lg:ml-20 xl:ml-40 text-h1">
        The {{ venue.name }}
      </h1>
      <div class="flex flex-wrap items-center justify-center">
        <div
          class="flex flex-col items-center w-full px-8 text-justify md:block md:w-auto md:max-w-md"
        >
          <p>
            {{ venue.description }}
          </p>
          <div class="mt-4">
            <p><strong>Capacity: </strong> Max {{ venue.internal_capacity }}</p>
          </div>
        </div>
        <div class="w-full max-w-xl h-80 md:w-2/3 md:m-4">
          <img
            class="w-full p-8"
            :src="venue.image"
            :alt="`${venue.name} image`"
            ref="image"
          />
        </div>
      </div>
      <div class="flex flex-wrap items-center justify-center">
        <div
          class="flex items-center justify-center w-full mb-4 lg:mb-0 lg:w-1/4 lg:order-last"
        >
          <div ref="address">
            <p class="font-semibold">Address:</p>
            <p v-if="venue.address.building_name">
              {{ venue.address.building_name }}
            </p>
            <p>
              <template v-if="venue.address.building_number">
                {{ venue.address.building_number }} </template
              >{{ venue.address.street }}
            </p>
            <p>{{ venue.address.city }}, {{ venue.address.postcode }}</p>
          </div>
        </div>
        <div
          v-if="!(!venue.address.latitude & !venue.address.longitude)"
          class="flex justify-center w-full lg:w-3/5 h-96 lg:mb-4"
        >
          <div class="w-full" id="mapContainer"></div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';

import { venueService } from '@/services';
import { handle404Mixin, runPromiseWithLoading } from '@/utils';

export default {
  name: 'venue-page',
  mixins: [handle404Mixin],
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
  created() {
    runPromiseWithLoading(
      venueService
        .fetchVenueBySlug(this.$route.params.venueSlug)
        .then((data) => (this.venue = data))
        .then(async () => {
          await this.$nextTick();
          this.createMap(this.venue);
        })
        .catch(this.handle404)
    );
  },
  methods: {
    createMap(venue) {
      if (!venue.latitude | !venue.longitude) {
        const map = L.map('mapContainer').setView(
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
      } else return;
    },
  },
};
</script>
