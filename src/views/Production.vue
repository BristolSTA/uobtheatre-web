<template>
  <div>
    <div class="flex">
      <div class="w-3/5 bg-sta-gray p-10">
        <div class="w-full text-center">
          <img
            :src="production.featured_image"
            :alt="`${production.name} feature image`"
            class="inline-block"
            style="max-height: 200px"
          />
        </div>
      </div>
      <div class="w-2/5 bg-sta-gray p-10">
        <div class="text-white font-semibold">
          <div class="text-h2">{{ production.name }}</div>
          <div class="text-sta-gray-verylight mb-1 -mt-2">
            {{ production.subtitle }} by {{ production.society.name }}
          </div>
          <div>Live at {{ production.performances }}</div>
          <div>
            {{ production.start_date | dateFormat('d MMM') }} -
            {{ production.end_date | dateFormat('d MMM y') }}
          </div>
          <div class="flex">
            <div class="w-6 text-center mr-1">
              <font-awesome-icon icon="clock" />
            </div>
            <div class="">Duration</div>
          </div>
          <div class="flex">
            <div class="w-6 text-center mr-1">
              <font-awesome-icon icon="ticket-alt" />
            </div>
            <div>Tickets avaliable from £{{ production.min_ticket_price }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { productionService } from '@/services';
export default {
  name: 'production',
  data() {
    return {
      production: null,
    };
  },
  created() {
    productionService
      .fetchProductionBySlug(this.$route.params.productionSlug)
      .then((data) => (this.production = data));
  },
};
</script>
