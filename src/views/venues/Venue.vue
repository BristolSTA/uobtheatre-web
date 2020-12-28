<template>
  <div class="h-full bg-sta-gray">
    <h1 class="pt-4 ml-10 text-left text-white lg:ml-20 xl:ml-40 text-h1">
      The {{ venue.name }}
    </h1>
    <div class="flex flex-wrap items-center justify-center">
      <div
        class="flex flex-col items-center w-full px-10 text-justify text-white md:block md:w-auto md:max-w-md"
      >
        <p>
          {{ venue.description }}
        </p>
        <br />
        <p><strong>Address: </strong></p>
        <p v-if="venue.address.building_name">
          {{ venue.address.building_name }}
        </p>
        <p>
          <template v-if="venue.address.building_number">
            {{ venue.address.building_number }} </template
          >{{ venue.address.street }}
        </p>
        <p>{{ venue.address.city }}, {{ venue.address.postcode }}</p>
        <p>{{ venue.address.latitude }}, {{ venue.address.longitude }}</p>
      </div>
      <div class="w-full max-w-xl m-6 h-80 md:w-2/3">
        <img
          class="w-full p-8"
          :src="venue.venue_image"
          :alt="`${venue.name} image`"
          ref="featured_image"
        />
      </div>
    </div>

    <!-- <div class="flex justify-center h-96">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2218.0465457381238!2d-2.6128241361907865!3d51.45667798827902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48718dc5ca9a5089%3A0xd52e92fe92092806!2sBristol%20SU%20(Richmond%20Building)!5e0!3m2!1sen!2suk!4v1607260466320!5m2!1sen!2suk"
        frameborder="0"
        allowfullscreen=""
        aria-hidden="false"
        tabindex="0"
        title="SU-map"
        class="flex w-full h-full p-8 md:w-2/3"
      ></iframe>
    </div> -->
  </div>
</template>

<script>
import { venueService } from '@/services';
import { handle404Mixin, runPromiseWithLoading } from '@/utils';

export default {
  name: 'venue',
  mixins: [handle404Mixin],
  metaInfo() {
    const venueName = this.venue ? this.venue.name : 'Loading...';
    return {
      title: `${venueName}`,
    };
  },
  data() {
    return {
      venue: null,
    };
  },
  created() {
    runPromiseWithLoading(
      venueService
        .fetchVenueBySlug(this.$route.params.venueSlug)
        .then((data) => (this.venue = data))
        .catch(this.handle404)
    );
  },
};
</script>
