<template>
  <div>
    <div id="splashscreen">
      <div
        v-if="!bannerProductions.length"
        class="flex items-center bg-black bg-opacity-40"
        style="min-height: 50vh"
      >
        <div class="container px-4 text-white lg:w-2/3">
          <div class="text-4xl">Welcome to {{ appConfig.name }}</div>
          <div class="text-2xl">
            The Home of Bristol Student Performing Arts
          </div>
        </div>
      </div>
      <UiCarousel v-else :carousel-items="bannerProductions">
        <template #default="slotProps">
          <div class="flex items-center h-full bg-black bg-opacity-40">
            <NuxtLink
              class="container px-4 md:pl-12 lg:pl-4 lg:w-2/3"
              :to="`/production/${slotProps.carouselItem.text.slug}`"
            >
              <div class="text-2xl">
                {{ slotProps.carouselItem.text.society.name }}
              </div>
              <div class="text-h1">
                {{ slotProps.carouselItem.text.name }}
              </div>
              <div class="text-2xl">
                {{
                  displayStartEnd(
                    slotProps.carouselItem.text.start,
                    slotProps.carouselItem.text.end,
                    'd MMMM'
                  )
                }}
              </div>
            </NuxtLink>
          </div>
        </template>
      </UiCarousel>
    </div>

    <div v-if="!!userTodaysBookings?.length" class="container mt-4 text-white">
      <h1 class="text-h1">My Bookings Today</h1>
      <div class="flex flex-wrap justify-center">
        <div
          v-for="(booking, index) in userTodaysBookings"
          :key="index"
          class="performance p-2 w-full md:w-1/2 xl:w-1/3"
        >
          <booking-summary-overview class="h-full" :booking="booking" />
        </div>
      </div>
    </div>

    <div ref="whatson" class="container mt-4 text-white">
      <h1 class="text-h1">What's On</h1>
      <div
        v-for="(production, index) in upcomingProductionsToDisplay"
        :key="production!.id"
        class="flex flex-wrap items-center py-4 production-feature"
        :class="{ 'flex-row-reverse': index % 2 == 1 }"
      >
        <div
          class="w-full p-2 text-center md:px-6 md:w-1/2"
          :class="[index % 2 == 0 ? 'md:text-right' : 'md:text-left']"
        >
          <NuxtLink :to="`/production/${production!.slug}`">
            <ProductionFeaturedImage
              :image-object="production!.featuredImage"
              :alt="`${production!.name} feature image`"
              class="inline-block"
              style="max-height: 300px"
            />
          </NuxtLink>
        </div>
        <div
          class="w-full p-2 text-center md:px-6 md:w-1/2"
          :class="[index % 2 == 0 ? 'md:text-left' : 'md:text-right']"
        >
          <NuxtLink :to="`/production/${production!.slug}`">
            <h2 class="font-semibold hover:text-gray-300 text-h2">
              {{ production!.name }}
            </h2>
          </NuxtLink>
          <span v-if="production!.subtitle">{{ production!.subtitle }}</span>
          <p class="font-semibold text-sta-orange">
            {{ displayStartEnd(production!.start, production!.end, 'd MMMM') }}
          </p>
          <p>
            {{ truncate(oneLiner(production!.description || ''), 230) }}
          </p>
          <NuxtLink
            :to="`/production/${production!.slug}`"
            class="mt-6 btn btn-green"
          >
            More Information & Book
          </NuxtLink>
        </div>
      </div>
      <div
        v-if="upcomingProductions.length == 0"
        class="flex items-center text-center"
        style="height: 30vh"
      >
        <div class="w-full">
          <h2 class="text-h2">There are currently no upcoming productions</h2>
          <p>Please be sure to check back soon!</p>
        </div>
      </div>
      <div
        v-if="upcomingProductions.length > upcomingProductionsToDisplay.length"
        class="flex items-center py-10 text-center"
      >
        <div class="w-full">
          <NuxtLink to="/productions" class="btn btn-outline btn-orange">
            See More <font-awesome-icon icon="arrow-right" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import take from 'lodash/take';
import {
  useHomepageUpcomingProductionsQuery,
  useCompleteBookingsQuery
} from '@/graphql/codegen/operations';
import BookingSummaryOverview from '@/components/booking/overview/BookingSummaryOverview.vue';
import { oneLiner, truncate } from '@/utils/lang';
import { displayStartEnd } from '@/utils/datetime';
import { DateTime } from 'luxon';
import useAuthStore from '@/store/auth';
const authStore = useAuthStore();

// Set SEO data
const appConfig = useAppConfig();
useHead({
  title: `${appConfig.name} | The Home Of Bristol Student Performing Arts`,
  titleTemplate: undefined
});

// Fetch upcoming productions (without blocking)
const { result: productionsResult } = useHomepageUpcomingProductionsQuery({
  now: new Date()
});

const upcomingProductions = computed(() =>
  productionsResult.value?.productions
    ? productionsResult.value.productions.edges.map((edge) => edge!.node)
    : []
);

const upcomingProductionsToDisplay = computed(() =>
  take(upcomingProductions.value, 4)
);

// Fetch user upcoming bookings
const { result: userBookingsResult } = useCompleteBookingsQuery(
  {
    active: true
  },
  { enabled: authStore.isLoggedIn }
);

const userTodaysBookings = computed(() => {
  const today = DateTime.now();
  const todayBookings = userBookingsResult.value?.me?.bookings?.edges
    .map((edge) => edge!.node)
    .filter((booking) => {
      let bookingDate = DateTime.fromISO(booking?.performance.start);
      return (
        bookingDate.hasSame(today, 'day') &&
        bookingDate.hasSame(today, 'month') &&
        bookingDate.hasSame(today, 'year')
      );
    });
  return todayBookings;
});

// Define banner productions
const bannerProductions = computed(() =>
  upcomingProductionsToDisplay.value
    .filter((production) => production?.coverImage)
    .map((production) => {
      return {
        id: production!.id,
        displayImage: production!.coverImage,
        text: {
          slug: production!.slug,
          name: production!.name,
          start: production!.start,
          end: production!.end,
          society: production!.society
        }
      };
    })
);
</script>

<style>
#splashscreen {
  background-image: url('~/assets/images/placeholder-homepage-splash.jpg');
  background-size: cover;
  background-position: center;
}
</style>
