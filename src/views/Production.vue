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
            {{ production.start_date | dateFormat('d MMMM') }} -
            {{ production.end_date | dateFormat('d MMMM y') }}
          </div>
          <div class="flex">
            <div style="margin-left: 5px; margin-right: 13px">
              <img
                src="~@/assets/images/clock.png"
                alt="ticket-img"
                class="inline-block pb-0.5"
                style="min-width: 16px; max-width: 16px"
              />
            </div>
            <div class="">Duration</div>
          </div>
          <div class="flex">
            <div style="margin-right: 8px">
              <img
                src="~@/assets/images/ticket-alt.png"
                alt="ticket-img"
                class="inline-block pb-0.5"
                style="max-width: 26px"
              />
            </div>
            <div>Tickets avaliable from £{{ production.min_ticket_price }}</div>
          </div>
        </div>
      </div>
    </div>
    {{ production ? production.name : 'Loading...' }}
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
