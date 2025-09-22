<template>
  <LayoutInfoPage :title="venue?.name" :banner="banner">
    <template #sidebar>
      <div class="flex justify-center w-full p-4">
        <div ref="venueInfo">
          <h2 class="text-sta-orange text-3xl font-semibold text-center">
            Venue Information
          </h2>
          <table class="table-auto mt-2">
            <tbody>
              <tr class="pb-2">
                <th class="align-top text-right pr-2">Capacity:</th>
                <td class="align-top">Max {{ venue.internalCapacity }}</td>
              </tr>
              <tr v-if="venue.website">
                <th class="align-top text-right pr-2">Website:</th>
                <td
                  class="align-top text-sta-orange hover:text-sta-orange-dark"
                >
                  <a
                    :href="venue.website"
                    target="_blank"
                    title="Opens in a new tab"
                  >
                    {{ website }}
                  </a>
                </td>
              </tr>
              <tr v-if="venue.email">
                <th class="align-top text-right pr-2">Contact:</th>
                <td
                  class="align-top text-sta-orange hover:text-sta-orange-dark"
                >
                  <a :href="`mailto:${venue.email}`">{{ venue.email }}</a>
                </td>
              </tr>
              <tr v-if="venue.address.what3words">
                <th class="align-top pr-2">what3words:</th>
                <td
                  class="align-top text-sta-orange hover:text-sta-orange-dark"
                >
                  <a
                    target="_blank"
                    :href="`https://what3words.com/${venue.address.what3words}`"
                  >
                    ///{{ venue.address.what3words }}
                  </a>
                </td>
              </tr>
              <tr class="py-2">
                <th class="align-top text-right pr-2">Address:</th>
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
                      {{ venue.address.city }},
                      {{ venue.address.postcode }}
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="text-sta-orange text-sm font-semibold">
            <a target="_blank" :href="googleMapsLink">
              <UiIconListItem class="justify-center" icon="map-marked-alt">
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
        class="flex justify-center w-full h-96 pb-4"
      >
        <UiMap
          v-if="venue !== null"
          class="w-full"
          data-test="map"
          @initalised="initMap"
        />
      </div>
    </template>

    <template #default>
      <div>
        <!-- Accessibility Information -->
        <h1 class="text-3xl font-semibold text-center mb-2">
          Accessibility Information
        </h1>
        <UiTipTapOutput :html="venue.accessibilityInfo" />
      </div>
    </template>
  </LayoutInfoPage>
</template>

<script>
import VenuePageDetails from '@/graphql/queries/venue/VenuePageDetails.gql';
import LayoutInfoPage from '@/components/layout/LayoutInfoPage.vue';

import L from 'leaflet';

export default defineNuxtComponent({
  components: { LayoutInfoPage },
  async asyncData() {
    const { data } = await useAsyncQuery({
      query: VenuePageDetails,
      variables: {
        slug: useRoute().params.slug
      }
    });

    const venue = data.value.venue;
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
  computed: {
    banner() {
      return this.venue?.image?.url ? `url("${this.venue.image.url}")` : null;
    },
    googleMapsLink() {
      return (
        `https://maps.google.com/?q=${this.venue.name}` +
        (this.venue.address
          ? `,${this.venue.address.street},${this.venue.address.city}`
          : '')
      );
    },
    website() {
      if (!this.venue?.website) return null;
      let website = this.venue.website;
      if (this.venue.website.startsWith('http://')) {
        return this.venue.website.slice(7);
      } else if (this.venue.website.startsWith('https://')) {
        return this.venue.website.slice(8);
      } else {
        return this.venue.website;
      }
    }
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
      L.marker([this.venue.address.latitude, this.venue.address.longitude])
        .addTo(map)
        .bindPopup(this.venue.name)
        .openPopup();
    }
  }
});
</script>
