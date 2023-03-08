<template>
  <div>
    <div>
      <button class="text-white hover:text-gray-300 font-bold" @click="cancel">
        <font-awesome-icon icon="arrow-left" /> Cancel
      </button>
    </div>
    <div class="my-2 py-2">
      <UiLoadingContainer :loading="!ticketMatrix" :show-content="false">
        <template v-if="ticketMatrix">
          <div class="flex gap-4 flex-col lg:flex-row">
            <div class="w-full lg:w-2/3">
              <BookingEditorTicketsEditor
                class="bg-sta-gray-dark"
                :booking="booking"
                :tickets-matrix="ticketMatrix"
                :show-capacities="true"
                :errors="errors"
                @change="updateApi"
              />
            </div>
            <div class="text-center flex-grow">
              <div class="bg-sta-gray-light p-4">
                <BookingSelectedTicketsTable
                  class="text-white overflow-auto"
                  row-class="bg-sta-gray-dark"
                  :ticket-matrix="ticketMatrix"
                  :booking="booking"
                  :show-total="true"
                />
                <div class="flex gap-2 justify-center">
                  <button
                    v-if="!booking.dirty && booking.tickets.length > 0"
                    class="btn btn-orange font-semibold"
                    @click="pay"
                    @keypress="pay"
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
              </div>
            </div>
          </div>
        </template>
      </UiLoadingContainer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Errors from '~~/classes/Errors';
import TicketsMatrix from '~~/classes/TicketsMatrix';
import { useFullPerformanceAndTicketOptionsQuery } from '~~/graphql/codegen/operations';
import { upsertBooking } from '~~/services/bookingMutationService';
import useBoxOfficeStore from '@/store/box-office';
import debounce from 'lodash/debounce';

const performance = inject(injectionKeys.boxOffice.performance);

if (!performance)
  throw createSafeError('There was an issue loading this performance');

const ticketMatrix = ref<TicketsMatrix | undefined>();
const errors = ref<Errors | undefined>();
const interactionTimer = debounce(updateApi, 2 * 1000);

const boxOfficeStore = useBoxOfficeStore();
const router = useRouter();

const booking = computed(() => boxOfficeStore.inProgressBooking);

// Load performance ticket options
const { onResult } = useFullPerformanceAndTicketOptionsQuery({
  id: performance.id
});
onResult((result) => {
  if (!result.data.performance || !result.data.performance.ticketOptions)
    return;
  ticketMatrix.value = new TicketsMatrix(result.data.performance);
  boxOfficeStore.inProgressBooking.performance = result.data.performance;
});

async function updateApi() {
  const response = await upsertBooking(boxOfficeStore.inProgressBooking);
  errors.value = response.errors;

  // Check for changes since API called.
  if (
    boxOfficeStore.inProgressBooking.tickets.length ===
    response.result?.booking?.tickets?.length
  ) {
    return boxOfficeStore.inProgressBooking.updateFromAPIData(
      response.result?.booking
    );
  }

  // There has been a change in the selected tickets whilst calling the API. Let's trigger another call...
  interactionTimer();
}

function pay() {
  router.push(`/box-office/${performance?.id}/sell/pay`);
}

function cancel() {
  boxOfficeStore.cancelInProgressBooking();
  router.push(`/box-office/${performance?.id}`);
}
</script>
