<template>
  <div class="px-1 py-2 my-2 md:p-2 bg-sta-gray-dark">
    <h2 class="flex justify-center mb-2 text-2xl">
      <slot name="title"></slot>
    </h2>
    <table class="w-full table-auto">
      <tbody>
        <tr
          v-for="(booking, index) in bookings"
          :key="index"
          class="odd:bg-sta-gray-light even:bg-sta-gray"
        >
          <td class="px-2 sm:px-4">
            <div>
              <router-link
                class="text-xl font-semibold hover:text-gray-300"
                :to="{
                  name: 'production',
                  params: {
                    productionSlug: booking.performance.production.slug,
                  },
                }"
              >
                {{ booking.performance.production.name }}
              </router-link>
              <p class="text-sta-orange">
                {{ booking.performance.start | dateFormat('d MMMM kkkk') }}
              </p>
            </div>
          </td>

          <td class="px-2 py-2 text-right sm:px-4">
            <p>Ref: {{ booking.reference }}</p>
            <router-link
              class="px-2 py-1 text-sm sm:mr-2 btn btn-green btn-outline"
              :to="{
                name: 'user.booking',
                params: { bookingRef: booking.reference },
              }"
            >
              View Booking
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
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
  },
};
</script>
