<template>
  <overview-box>
    <template v-slot:title>Venue</template>
    <template v-if="!venue" v-slot:subtitle>
      <font-awesome-icon class="animate-spin" icon="circle-notch" />
    </template>
    <template v-else v-slot:subtitle>
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
    <div v-if="venue">
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
</template>

<script>
import OverviewBox from '@/components/overview/OverviewBox.vue';
import { venueService } from '@/services';
import { runPromiseWithLoading } from '@/utils';
import { handle404Mixin } from '@/utils';

export default {
  name: 'venue-overview',
  components: { OverviewBox },
  mixins: [handle404Mixin],
  props: {
    venue_data: {
      requried: true,
    },
  },
  data() {
    return {
      venue: null,
    };
  },
  created() {
    if (typeof this.venue_data == 'string') {
      return runPromiseWithLoading(
        venueService.fetchVenueBySlug(this.venue_data).then((data) => {
          this.venue = data;
        })
      );
    }
    this.venue = this.venue_data;
  },
};
</script>
