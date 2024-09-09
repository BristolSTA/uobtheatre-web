<template>
  <div>
    <div class="container mt-4 text-white text-center lg:text-left">
      <div class="flex flex-col justify-center">
        <h1 class="text-h1 capitalize">Hey {{ authStore.user?.firstName }}</h1>
        <p class="text-lg lg:pb-2">Don't forget about today's booking!</p>
      </div>
      <div class="flex flex-wrap justify-center">
        <div
          class="flex flex-col-reverse lg:flex-row lg:bg-sta-gray-light lg:p-2 rounded-lg"
        >
          <div class="px-2 pt-0 lg:flex lg:flex-col lg:w-2/3">
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
            <template v-if="booking.performance.venue?.publiclyListed">
              <NuxtLink
                class="hover:text-gray-300 font-semibold text-2xl"
                :to="`/venue/${booking.performance.venue?.slug}`"
              >
                {{ booking.performance.venue?.name }}
              </NuxtLink>
            </template>
            <template v-else>
              {{ booking.performance.venue?.name }}
            </template>

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
          <div class="lg:flex lg:items-center">
            <div class="py-2 px-4 hidden justify-center lg:flex">
              <ProductionPosterImage
                :image-object="booking.performance.production.posterImage"
                style="max-height: 275px"
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
      <div
        v-if="props.bookings.length > 1"
        class="py-4 mt-1 flex justify-center"
      >
        <button class="btn btn-orange btn-outline text-center font-semibold">
          <NuxtLink :to="`/user`">
            You have additonal bookings today
            <font-awesome-icon icon="chevron-right" />
          </NuxtLink>
        </button>
      </div>
    </div>
    <hr class="h-px mb-10 mt-4 bg-slate-900 border-0 drop-shadow-2xl" />
  </div>
</template>

<script setup lang="ts">
import type { UpcomingBookingsQuery } from '~~/graphql/codegen/operations';
import useAuthStore from '@/store/auth';
import { dateFormat } from '@/utils/datetime';
const authStore = useAuthStore();

type BookingData = NonNullable<
  NonNullable<
    NonNullable<UpcomingBookingsQuery['me']>['bookings']['edges'][number]
  >['node']
>;

const props = defineProps<{
  bookings: Array<BookingData>;
}>();

const booking = computed(() => props.bookings[0]);
</script>
