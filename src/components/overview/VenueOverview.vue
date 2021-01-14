<template>
  <overview-box>
    <template v-slot:title>Venue</template>
    <template v-slot:subtitle>
      <font-awesome-icon
        v-if="!venue"
        class="animate-spin"
        icon="circle-notch"
      />
      <router-link
        v-else
        :to="{
          name: 'venue',
          params: { venueSlug: venue.slug },
        }"
        target="_blank"
        title="Opens in a new tab"
      >
        <icon-list-item icon="link">The {{ venue.name }}</icon-list-item>
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

import IconListItem from '../ui/IconListItem.vue';

export default {
  name: 'venue-overview',
  components: { OverviewBox, IconListItem },
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
