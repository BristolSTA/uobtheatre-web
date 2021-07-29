<template>
  <div class="h-full text-white bg-sta-gray">
    <h1 class="container pt-2 text-left text-h1">{{ venue.name }}</h1>
    <div class="flex flex-wrap items-center justify-center mt-2 lg:mb-8">
      <div class="w-full px-8 text-justify md:block md:w-auto md:max-w-md">
        {{ venue.description }}
      </div>
      <div
        v-if="venue.image.url"
        class="w-full h-full max-w-xl lg:w-2/3 md:m-4"
      >
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
        class="flex justify-center w-full p-4 lg:w-1/4 lg:order-last lg:ml-4 bg-sta-gray-dark"
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
        v-if="
          venue.address && venue.address.latitude && venue.address.longitude
        "
        class="flex justify-center w-full lg:w-3/5 h-96 lg:mb-4"
      >
        <div ref="venue-map" class="w-full"></div>
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import L from 'leaflet'

import IconListItem from '@/components/ui/IconListItem.vue'
import AddressFragment from '@/graphql/fragments/AddressFragment.gql'

export default {
  name: 'VenuePage',
  components: { IconListItem },
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
    })
    const venue = data.venue
    if (!venue)
      return error({
        statusCode: 404,
        message: 'This society does not exists',
      })

    return {
      venue,
    }
  },
  data() {
    return {
      venue: null,
    }
  },
  head() {
    const venueName = this.venue ? this.venue.name : 'Loading...'
    return {
      title: `${venueName}`,
    }
  },
  computed: {
    googleMapsLink() {
      return (
        `https://maps.google.com/?q=${this.venue.name}` +
        (this.venue.address
          ? `,${this.venue.address.street},${this.venue.address.city}`
          : '')
      )
    },
  },
  mounted() {
    this.createMap()
  },
  methods: {
    createMap() {
      const venue = this.venue
      if (!venue?.address?.latitude || !venue?.address?.longitude) return
      const map = L.map(this.$refs['venue-map']).setView(
        [venue.address.latitude, venue.address.longitude],
        14
      )
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      L.popup({ closeButton: false })
        .setLatLng(L.latLng(venue.address.latitude, venue.address.longitude))
        .setContent(`${venue.name}`)
        .openOn(map)
    },
  },
}
</script>
