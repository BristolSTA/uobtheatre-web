<template>
  <div class="px-1 py-2 my-2 md:p-2 bg-sta-gray-dark">
    <h2 class="flex justify-center mb-2 text-2xl">
      <slot name="title"></slot>
    </h2>
    <table v-if="bookings.length" class="w-full table-auto">
      <tbody>
        <tr
          v-for="(booking, index) in bookings"
          :key="index"
          class="odd:bg-sta-gray-light even:bg-sta-gray"
        >
          <td class="px-2 sm:px-4">
            <div>
              <NuxtLink
                class="text-xl font-semibold hover:text-gray-300"
                :to="`/production/${booking.performance.production.slug}`"
              >
                {{ booking.performance.production.name }}
              </NuxtLink>
              <p class="text-sta-orange">
                {{ booking.performance.start | dateFormat('d MMMM kkkk') }}
              </p>
            </div>
          </td>

          <td class="px-2 py-2 text-right sm:px-4">
            <p>
              Ref: <span class="font-mono">{{ booking.reference }}</span>
            </p>
            <NuxtLink
              class="px-2 py-1 text-sm sm:mr-2 btn btn-green btn-outline"
              :to="`/user/booking/${booking.reference}`"
            >
              View Booking
            </NuxtLink>
          </td>
        </tr>
      </tbody>
    </table>
    <h4 v-else class="p-2 text-center text-h4">No Previous Bookings</h4>
    <div v-if="canLoadMore" class="mt-4 text-center">
      <button
        class="btn btn-green"
        @click="$emit('load-more')"
        @keypress="$emit('load-more')"
      >
        Load More
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookingsTable',
  props: {
    bookings: {
      required: true,
      type: Array,
    },
    canLoadMore: {
      default: false,
      type: Boolean,
    },
  },
}
</script>
