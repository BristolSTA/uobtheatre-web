<template>
  <div>
    <div class="my-2 p-2">
      <UiLoadingContainer :loading="!ticketMatrix">
        <template v-if="ticketMatrix">
          <p class="text-center font-semibold text-white">
            {{ ticketMatrix.performanceCapacityRemaining }} tickets available
          </p>
          <BookingEditorTicketsEditor
            :booking="booking"
            :tickets-matrix="ticketMatrix"
            :show-capacities="true"
            :errors="errors"
            @change="updateApi"
          />
          <div v-if="booking.tickets.length" class="mt-2 text-center">
            <button
              class="btn btn-orange font-semibold"
              :disabled="booking.dirty"
              @click="$emit('next-stage')"
              @keypress="$emit('next-stage')"
            >
              Proceed to Payment
            </button>
            <button
              class="btn bg-gray-400 hover:bg-gray-500 font-semibold"
              @click="cancel"
              @keypress="cancel"
            >
              Cancel Booking
            </button>
          </div>
        </template>
      </UiLoadingContainer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Booking from '~~/classes/Booking';
import Errors from '~~/classes/Errors';
import TicketsMatrix from '~~/classes/TicketsMatrix';
import { useFullPerformanceAndTicketOptionsQuery } from '~~/graphql/codegen/operations';
import { upsertBooking } from '~~/services/bookingMutationService';
import useBoxOfficeStore from '@/store/box-office';
import debounce from 'lodash/debounce';

const performance = inject(injectionKeys.boxOffice.performance);

if (!performance)
  throw createSafeError('There was an issue loading this performance');

const booking = ref(new Booking());
const ticketMatrix = ref<TicketsMatrix | undefined>();
const errors = ref<Errors | undefined>();
const interactionTimer = ref(debounce(updateApi, 2 * 1000));

const boxOfficeStore = useBoxOfficeStore();

const { onResult } = useFullPerformanceAndTicketOptionsQuery({
  id: performance.id
});
onResult((result) => {
  ticketMatrix.value = new TicketsMatrix(result.data.performance);
  booking.value.performance = result.data.performance ?? undefined;
});

async function updateApi() {
  const response = await upsertBooking(booking.value);
  errors.value = response.errors;

  // Update booking ID in store
  boxOfficeStore.$patch({ inProgressBookingID: response.result?.booking?.id });

  // Check for changes since API called.
  if (
    booking.value.tickets.length === response.result?.booking?.tickets?.length
  ) {
    return booking.value.updateFromAPIData(response.result?.booking);
  }

  // There has been a change in the selected tickets whilst calling the API. Let's trigger another call...
  interactionTimer();
}
</script>
