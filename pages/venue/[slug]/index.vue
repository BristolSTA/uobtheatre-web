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
    <div
      class="container grid gap-4 p-4 grid-cols-1 lg:grid-cols-5"
      style="grid-template-rows: auto auto auto"
    >
      <div class="lg:col-start-1 lg:col-span-5 lg:row-start-1">
        <!-- Title -->
        <h1 class="container align-middle py-6 text-left text-h1">
          {{ venue.name }}
        </h1>
      </div>
      <div class="lg:col-start-1 lg:col-span-3 lg:row-start-2 rounded">
        <div
          v-if="!bannerProductions.length"
          class="flex items-center bg-black bg-opacity-40"
          style="min-height: 20vh"
        >
          <div class="container px-4 text-white text-center text-2xl lg:w-2/3">
            No Upcoming Productions
          </div>
        </div>
        <UiCarousel v-else: :carousel-items="bannerProductions">
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
      <div
        class="lg:col-start-4 lg:col-span-2 lg:row-start-2 lg:row-span-2 lg:sticky lg:top-4"
      >
        <!-- Banner Information Section -->
        <div
          class="flex flex-col flex-wrap items-center justify-center bg-sta-gray-light rounded-lg"
        >
          <div class="flex justify-center w-full px-4 pt-4 pb-2">
            <div>
              <h2 class="text-sta-orange text-3xl font-semibold">
                Venue Info:
              </h2>
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
            class="flex justify-center w-full h-96 py-2"
          >
            <UiMap
              v-if="venue !== null"
              class="w-full"
              data-test="map"
              @initalised="initMap"
            />
          </div>
          <div class="flex justify-center w-full px-4 pt-2 pb-4">
            <div ref="accessibilityInfo">
              <h2 class="text-sta-orange text-3xl font-semibold">
                Accessibility Info:
              </h2>
              <div class="mt-2 text-white">
                <p v-if="venue.accessibilityInfo">
                  {{ venue.accessibilityInfo }}
                </p>
                <p v-else class="font-semibold">
                  No accessibility information available for this venue
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="lg:col-start-1 lg:col-span-3 lg:row-start-3">
        <!-- Description -->
        <UiTipTapOutput
          class="p-4 w-full text-justify lg:block"
          :html="venue.description"
        />
      </div>
      <div
        v-if="pastProductions.length"
        class="lg:col-start-1 lg:col-span-3 lg:row-start-4"
      >
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
                    <NuxtLink :to="`/production/${production.slug}`">
                      {{ production.name }}
                    </NuxtLink>
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
    </div>
  </div>
</template>

<script>
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
    }
  }
});
</script>
