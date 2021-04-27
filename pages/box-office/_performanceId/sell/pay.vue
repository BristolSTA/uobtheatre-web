<template>
  <div>
    <div class="grid grid-cols-2 gap-2">
      <tickets-overview :booking="booking" />
      <booking-price-overview :booking="booking" />
    </div>
    <div class="grid grid-cols-2 gap-2 my-4">
      <div class="p-3 rounded bg-sta-gray-dark">
        <h2 class="text-center text-h2">Details</h2>
        <text-input v-model="firstName" name="First Name" required />
        <text-input v-model="lastName" name="Last Name" required />
        <text-input v-model="email" name="Email" type="email" required />
      </div>
      <div class="p-3 rounded bg-sta-gray-dark">
        <h2 class="text-center text-h2">Payment</h2>
        <h3 class="text-center text-h3 text-sta-orange">
          £{{ booking.totalPricePounds }} due
        </h3>
        <div class="grid grid-cols-2 gap-2">
          <div class="text-center">
            <button
              class="p-2 transition-colors rounded bg-sta-green hover:bg-sta-green-dark"
            >
              <font-awesome-icon icon="money-check-alt" />
              Paid using Card
            </button>
            <p class="text-sm">
              Process the payment using the card machine. Press here once
              authorised
            </p>
          </div>
          <div class="text-center">
            <button
              class="p-2 transition-colors rounded bg-sta-green hover:bg-sta-green-dark"
            >
              <font-awesome-icon icon="money-bill" />
              Paid with Cash
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TextInput from '@/components/ui/TextInput.vue'
import Booking from '@/classes/Booking'
import BookingPriceOverview from '@/components/booking/overview/BookingPriceOverview.vue'
import TicketsOverview from '@/components/booking/overview/TicketsOverview.vue'
export default {
  components: { TextInput, BookingPriceOverview, TicketsOverview },
  props: {
    booking: {
      required: true,
      type: Booking,
    },
  },
  data() {
    return {
      firstName: null,
      lastName: null,
      email: null,
    }
  },
}
</script>
