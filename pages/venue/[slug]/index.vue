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
      <!-- Merged former sidebar-bottom content into sidebar -->
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
      <div class="flex justify-center w-full px-4 pb-4">
        <div ref="accessibilityInfo">
          <h2 class="text-sta-orange text-3xl font-semibold text-center">
            Accessibility Summary
          </h2>
          <div class="mt-2 text-white text-justify">
            <p v-if="venue.accessibilityShort">
              {{ venue.accessibilityShort }}
            </p>
            <p v-else class="font-semibold">
              No accessibility information has been listed for this venue
            </p>
          </div>
          <div
            v-if="venue.accessibilityInfo"
            class="text-sta-orange text-sm font-semibold mt-2"
          >
            <NuxtLink :to="`/venue/${useRoute().params.slug}/accessibility`">
              <UiIconListItem class="justify-center" icon="arrow-right">
                Read more about this venue's accessibility information
              </UiIconListItem>
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>

    <template #default>
      <div v-if="bannerProductions.length">
        <!-- Upcoming Shows Carousel -->
        <h1 class="text-3xl font-semibold text-center mb-2">
          Upcoming Productions
        </h1>
        <UiCarousel :carousel-items="bannerProductions">
          <template #default="slotProps">
            <div class="flex items-center h-full bg-black bg-opacity-40">
              <NuxtLink
                class="container px-4 md:pl-12 lg:pl-4 lg:w-2/3"
                :to="`/production/${slotProps.carouselItem.text.slug}`"
              >
                <div class="text-2xl">
                  {{ slotProps.carouselItem.text.society.name }}
                </div>
                <div class="text-h1">
                  {{ slotProps.carouselItem.text.name }}
                </div>
                <div class="text-2xl">
                  {{
                    displayStartEnd(
                      slotProps.carouselItem.text.start,
                      slotProps.carouselItem.text.end,
                      'd MMMM'
                    )
                  }}
                </div>
              </NuxtLink>
            </div>
          </template>
        </UiCarousel>
      </div>
      <div v-if="venue.description" class="mt-4">
        <!-- Description -->
        <h1 class="text-3xl font-semibold text-center mb-2">
          Venue Description
        </h1>
        <UiTipTapOutput :html="venue.description" />
      </div>
      <div v-if="pastProductions.length" class="mx-4 mt-4">
        <!-- Past Shows -->
        <div ref="production-list" class="flex-none container">
          <div class="w-full bg-sta-gray-dark">
            <h2 class="flex justify-center mb-2 text-2xl">Past Productions</h2>
            <table class="table-auto w-full">
              <tbody>
                <tr
                  v-for="(production, index) in pastProductions"
                  :key="index"
                  class="even:bg-sta-gray odd:bg-sta-gray-light"
                >
                  <td
                    class="pl-4 py-2 hover:text-gray-300 text-xl font-semibold"
                  >
                    <NuxtLink :to="`/production/${production.slug}`">{{
                      production.name
                    }}</NuxtLink>
                  </td>
                  <td class="px-4 text-right">
                    {{ dateFormat(production.end, 'MMMM y') }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
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
        slug: useRoute().params.slug,
        now: new Date()
      }
    });

    const venue = data.value.venue;
    if (!venue) {
      throw createSafeError({
        statusCode: 404,
        message: 'This venue does not exist'
      });
    }

    const upcomingProductions = venue.productions
      ? venue.productions.edges.map((edge) => edge.node)
      : [];

    const bannerProductions = upcomingProductions
      .filter((production) => production?.coverImage)
      .map((production) => {
        return {
          id: production.id,
          displayImage: production.coverImage,
          text: {
            slug: production.slug,
            name: production.name,
            start: production.start,
            end: production.end,
            society: production.society
          }
        };
      })
      .slice(0, 4);

    return {
      venue,
      bannerProductions
    };
  },
  data() {
    return {
      venue: null,
      bannerProductions: null
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
    productions() {
      return this.venue.productions.edges
        .map((edge) => edge.node)
        .filter((production) => production.end);
    },
    pastProductions() {
      return this.productions.filter(
        (production) => new Date(production.end) < new Date()
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
