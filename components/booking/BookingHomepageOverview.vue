<template>
  <div>
    <div class="container mt-4 text-white text-center lg:text-left">
      <h1 class="text-h1 capitalize">Hey {{ authStore.user?.firstName }}</h1>
      <p class="text-lg lg:pb-2">Don't forget about today's booking!</p>
      <div class="flex flex-wrap justify-center">
        <div
          v-for="(booking, index) in props.bookings"
          :key="index"
          class="w-full flex flex-col-reverse lg:flex-row lg:bg-sta-gray-light lg:p-2 rounded-lg"
        >
          <div class="px-2 pt-0">
            <div class="hidden lg:block pb-4">
              <span class="text-h1">{{
                booking.performance.production.name
              }}</span>
              <p class="-mt-2 mb-1 text-sta-gray-lighter font-semibold">
                by
                <NuxtLink
                  class="hover:text-gray-400 text-sta-gray-lighter font"
                  :to="`/society/${booking.performance.production.society?.slug}`"
                >
                  {{ booking.performance.production.society?.name }}
                </NuxtLink>
              </p>
            </div>
            <NuxtLink
              v-if="booking.performance.venue?.publiclyListed"
              class="hover:text-gray-300 font-semibold text-2xl"
              :to="`/venue/${booking.performance.venue?.slug}`"
            >
              {{ booking.performance.venue?.name }}
            </NuxtLink>
            <p class="text-sta-orange text-xl">
              Doors Open: {{ dateFormat(booking.performance.doorsOpen, 'T') }}
            </p>
            <p class="text-sta-rouge text-xl hidden lg:block pb-4">
              Performance Starts:
              {{ dateFormat(booking.performance.start, 'T') }}
            </p>
            <NuxtLink
              class="flex btn btn-green mt-2 w-full justify-center text-h4"
              :to="`/user/booking/${booking.reference}?toTickets`"
            >
              View Booking &amp; Tickets
            </NuxtLink>
          </div>
          <div>
            <div class="py-2 px-14 hidden justify-center lg:flex">
              <ProductionPosterImage
                :image-object="booking.performance.production.posterImage"
                style="max-height: 400px"
              />
            </div>
            <div class="py-2 px-4 lg:hidden justify-center flex">
              <ProductionFeaturedImage
                :image-object="booking.performance.production.featuredImage"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr class="h-px my-10 bg-slate-900 border-0 drop-shadow-2xl" />
  </div>
</template>

<script setup lang="ts">
import { UpcomingBookingsQuery } from '~~/graphql/codegen/operations';
import useAuthStore from '@/store/auth';
const authStore = useAuthStore();

type BookingData = NonNullable<
  NonNullable<
    NonNullable<UpcomingBookingsQuery['me']>['bookings']['edges'][number]
  >['node']
>;

const props = defineProps<{
  bookings: Array<BookingData>;
}>();
</script>
