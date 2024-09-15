<template>
  <div v-if="!bannerDismissed" class="bg-sta-gray-dark">
    <hr class="h-px bg-slate-900 border-0 drop-shadow-2xl" />
    <div
      class="container text-white text-center md:text-left mb-2 flex gap-2 p-2 items-start justify-center"
    >
      <div>
        <h1 class="text-h2 md:text-h1 capitalize px-4 text-left sm:text-center">
          Today's Bookings
        </h1>
        <div class="flex flex-wrap justify-center mx-4">
          <!-- Booking card -->
          <div
            class="flex flex-col-reverse md:flex-row md:bg-sta-gray-light md:p-2 rounded-lg"
          >
            <div class="px-2 md:flex md:flex-col md:justify-evenly md:w-2/3">
              <div class="md:pb-4">
                <!-- Shows the production & society name -->
                <span class="text-h2 md:text-h1">{{
                  booking.performance.production.name
                }}</span>
                <p class="-mt-2 text-sta-gray-lighter text-xl font-semibold">
                  <NuxtLink
                    class="hover:text-gray-400 text-sta-gray-lighter font"
                    :to="`/society/${booking.performance.production.society?.slug}`"
                  >
                    by {{ booking.performance.production.society?.name }}
                  </NuxtLink>
                </p>
              </div>
              <div>
                <!-- Links to the venue if it's listed -->
                <template v-if="booking.performance.venue?.publiclyListed">
                  <NuxtLink
                    class="hover:text-gray-300 font-semibold text-h3"
                    :to="`/venue/${booking.performance.venue?.slug}`"
                  >
                    {{ booking.performance.venue?.name }}
                  </NuxtLink>
                </template>
                <template v-else>
                  {{ booking.performance.venue?.name }}
                </template>
              </div>
              <div>
                <!-- Shows production information -->
                <p class="text-sta-orange text-xl">
                  Doors Open:
                  {{ dateFormat(booking.performance.doorsOpen, 'T') }}
                </p>
                <p class="text-sta-rouge text-xl">
                  Performance Starts:
                  {{ dateFormat(booking.performance.start, 'T') }}
                </p>
              </div>
              <NuxtLink
                class="flex btn btn-green mt-2 w-full justify-center text-h4"
                :to="`/user/booking/${booking.reference}?toTickets`"
              >
                View Booking &amp; Tickets
              </NuxtLink>
            </div>
            <div class="md:flex md:items-center">
              <div class="py-2 hidden justify-center md:flex">
                <ProductionPosterImage
                  :image-object="booking.performance.production.posterImage"
                  style="max-height: 275px"
                />
              </div>
              <div class="py-2 md:hidden justify-center flex">
                <ProductionFeaturedImage
                  :image-object="booking.performance.production.featuredImage"
                />
              </div>
            </div>
          </div>
        </div>
        <div v-if="bookings.length > 1" class="pt-4 flex justify-center">
          <!-- Additional bookings segment -->
          <button class="btn btn-orange btn-outline text-center font-semibold">
            <NuxtLink :to="`/user`">
              You have additonal bookings today
              <font-awesome-icon icon="chevron-right" />
            </NuxtLink>
          </button>
        </div>
      </div>
      <div class="absolute right-0">
        <!-- Dismissal button -->
        <UiStaButton
          class="text-h3 md:text-h1 mx-2 -my-2"
          icon="xmark"
          @click="dismissBanner"
        />
      </div>
    </div>
    <hr class="h-px bg-slate-900 border-0 drop-shadow-2xl" />
  </div>
</template>

<script>
import useAuthStore from '@/store/auth';
import { swalToast } from '@/utils/alerts';

export default {
  props: {
    bookings: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      authStore: useAuthStore(),
      bannerDismissed: false
    };
  },
  computed: {
    booking() {
      return this.bookings[0];
    }
  },
  methods: {
    dismissBanner() {
      swalToast.fire({
        icon: 'info',
        title: "Today's Bookings Dismissed",
        text: "Reload the page or navigate to Your Bookings to see today's bookings again.",
        position: 'bottom-end',
        timer: 10000
      });
      this.bannerDismissed = true;
    }
  }
};
</script>
