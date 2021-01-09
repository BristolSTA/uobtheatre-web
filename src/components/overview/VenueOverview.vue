<template>
  <div>
    <overview-box :subtitle="true">
      <template v-slot:title>Venue</template>
      <template v-slot:subtitle>
        <router-link
          :to="{
            name: 'venue',
            params: { venueSlug: venue.slug },
          }"
          target="_blank"
        >
          The {{ venue.name }}
        </router-link>
      </template>
      <div>
        <p v-if="venue.address.building_name">
          {{ venue.address.building_name }}
        </p>
        <p>
          <template v-if="venue.address.building_number">
            {{ venue.address.building_number }}
          </template>
          {{ venue.address.street }}
        </p>
        <p>{{ venue.address.city }}</p>
        <p>{{ venue.address.postcode }}</p>
      </div>
    </overview-box>
  </div>
</template>

<script>
import OverviewBox from '@/components/overview/OverviewBox.vue';
import { venueService } from '@/services';
import { runPromiseWithLoading } from '@/utils';

export default {
  name: 'venue-overview',
  components: { OverviewBox },
  props: {
    venue_slug: {
      required: true,
    },
  },
  data() {
    return {
      venue: null,
    };
  },
  created() {
    runPromiseWithLoading(
      venueService
        .fetchVenueBySlug(this.venue_slug)
        .then((data) => {
          this.venue = data;
          this.$nextTick(() => {
            this.createMap(this.venue);
          });
        })
        .catch(this.handle404)
    );
  },
};
</script>
