<template>
  <UiCard>
    <loading-container :loading="loading">
      <BookingSelectedPerformanceBar
        v-if="booking.performance"
        :performance="booking.performance"
      />
      <tickets-editor
        :booking="booking"
        :tickets-matrix="ticketsMatrix"
        :show-capacities="true"
        :show-prices="false"
        :errors="errors"
      />
      <BookingSelectedTicketsTable
        v-if="booking.tickets.length"
        class="mt-2"
        :ticket-matrix="ticketsMatrix"
        :booking="booking"
      />
      <form-label class="py-4" :required="true">
        User Email
        <template #control>
          <UiInputText
            v-model="bookingEmail"
            :disabled="!!booking.id"
            type="text"
            placeholder="joe.bloggs@example.org"
          />
        </template>
      </form-label>
      <UiStaButton
        colour="orange"
        :disabled="!bookingEmail || !booking.tickets.length"
        @click="create"
      >
        Create Booking
      </UiStaButton>
      <p>
        <strong>Note:</strong> Only complimentary bookings (100% discount) can
        be created here. Once you click create, booking confirmation will be
        sent to the email specified, and the booking will be instantly
        completed.
      </p>
    </loading-container>
  </UiCard>
</template>

<script>
import FullPerformanceAndTicketOptionsQuery from '@/graphql/queries/FullPerformanceAndTicketOptions.gql';
import BookingMutation from '@/graphql/mutations/booking/Booking.gql';
import PayBookingMutation from '@/graphql/mutations/booking/PayBooking.gql';
import TicketsMatrix from '@/classes/TicketsMatrix';
import Booking from '~~/classes/Booking';
import TicketsEditor from '@/components/booking/editor/TicketsEditor.vue';

import FormLabel from '@/components/ui/FormLabel.vue';

import { getValidationErrors, performMutation } from '~~/utils/api';
import { successToast } from '~~/utils/alerts';
import LoadingContainer from '@/components/ui/LoadingContainer.vue';

export default defineNuxtComponent({
  components: {
    TicketsEditor,

    FormLabel,
    LoadingContainer
  },
  async asyncData() {
    const { data } = await useDefaultApolloClient().query({
      query: FullPerformanceAndTicketOptionsQuery,
      variables: {
        id: useRoute().params.performanceId
      },
      fetchPolicy: 'no-cache'
    });

    const performance = data.performance;
    if (!performance) {
      throw createSafeError({
        statusCode: 404,
        message: 'This performance does not exist'
      });
    }

    const ticketsMatrix = new TicketsMatrix(performance);

    const booking = new Booking();
    booking.performance = performance;

    return {
      ticketsMatrix,
      performance,
      booking
    };
  },
  data() {
    return {
      ticketsMatrix: null,
      performance: null,
      loading: false,

      booking: null,
      bookingEmail: null,
      errors: null
    };
  },
  head: {
    title: 'Create Complimentary Booking'
  },
  methods: {
    async create() {
      this.loading = true;
      try {
        // Make the booking
        const data = await performMutation(
          this.$apollo,
          {
            mutation: BookingMutation,
            variables: {
              input: {
                adminDiscountPercentage: 1,
                performance: this.performance.id,
                userEmail: this.bookingEmail,
                tickets: this.booking.toAPIData().tickets
              }
            }
          },
          'booking'
        );
        this.booking.updateFromAPIData(data.booking.booking);

        // Pay the booking
        await performMutation(
          this.$apollo,
          {
            mutation: PayBookingMutation,
            variables: {
              id: this.booking.id,
              totalPence: this.booking.totalPrice
            }
          },
          'payBooking'
        );

        successToast.fire({
          title: 'Booking created!'
        });

        useRouter().replace(`../${this.booking.reference}`);
      } catch (e) {
        this.errors = getValidationErrors(e);
      } finally {
        this.loading = false;
      }
    }
  }
});
</script>
