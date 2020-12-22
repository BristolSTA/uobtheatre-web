<template>
  <div class="text-white">
    <seat-location
      v-for="(location, locationIndex) in locations"
      :key="locationIndex"
      :location="location"
      :expanded="true"
    />
  </div>
</template>

<script>
import SeatLocation from '@/views/bookings/components/SeatLocation.vue';

export default {
  name: 'ticket-selection-stage',
  components: { SeatLocation },
  props: {
    production: {
      required: true,
    },
  },
  data() {
    return {
      expanded: true,
      locations: [
        {
          name: 'Standing',
          ticket_types: [
            {
              name: 'Adult',
              price_pounds: '12.00',
            },
            {
              name: 'Child',
              price_pounds: '5.00',
            },
          ],
        },
        {
          name: 'Seated',
          ticket_types: [
            {
              name: 'Adult',
              price_pounds: '20.00',
            },
            {
              name: 'Child',
              price_pounds: '10.00',
            },
          ],
        },
      ],
      selected_location_index: null,
    };
  },
  methods: {},
};
</script>
