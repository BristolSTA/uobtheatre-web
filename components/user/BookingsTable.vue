<template>
  <div class="my-2 px-1 py-2 bg-sta-gray-dark md:p-2">
    <h2 class="flex justify-center mb-2 text-2xl">
      <slot name="title" />
    </h2>
    <table v-if="bookings.length" class="table-auto w-full">
      <tbody>
        <tr
          v-for="(booking, index) in bookings"
          :key="index"
          class="even:bg-sta-gray odd:bg-sta-gray-light"
        >
          <td class="px-2 sm:px-4">
            <div>
              <NuxtLink
                class="hover:text-gray-300 text-xl font-semibold"
                :to="`/production/${booking.performance.production.slug}`"
              >
                {{ booking.performance.production.name }}
              </NuxtLink>
              <p class="text-sta-orange">
                {{ dateFormat(booking.performance.start, 'd MMMM kkkk') }}
              </p>
            </div>
          </td>

          <td class="px-2 py-2 text-right sm:px-4">
            <p>
              Ref: <span class="font-mono">{{ booking.reference }}</span>
            </p>
            <NuxtLink
              class="btn btn-green btn-outline px-2 py-1 text-sm sm:mr-2"
              :to="`/user/booking/${booking.reference}`"
            >
              View Booking
            </NuxtLink>
          </td>
        </tr>
      </tbody>
    </table>
    <h4 v-else class="p-2 text-center text-h4">No Previous Bookings</h4>
  </div>
</template>

<script>
import { dateFormat } from '@/utils/datetime';
export default {
  name: 'BookingsTable',
  props: {
    bookings: {
      required: true,
      type: Array
    },
    canLoadMore: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    dateFormat
  }
};
</script>
