<template>
  <AdminPage title="Refund Booking">
    <template #toolbar>
      <UiStaButton
        v-if="authStore.hasPermission('refund_booking')"
        class="bg-sta-rouge hover:bg-sta-rouge-dark transition-colors mt-2"
        @click="refundBooking"
      >
        Refund Booking
      </UiStaButton>
    </template>
    <h2 class="text-sta-orange text-h2">Reference - {{ booking.reference }}</h2>
    <UiCard title="Refund Type" class="mb-4">
      <form-label>
        Refund Type
        <template #control>
          <UiSelect v-model="production.name" placeholder="Select refund type">
            <option value="full">Full Refund</option>
            <option value="partial">Partial Refund</option>
          </UiSelect>
        </template>
        <template #helper>
          Select the type of refund you wish to process.
        </template>
      </form-label>
    </UiCard>
    <UiCard title="Refund Information" class="mb-4">
      <form-label>
        Refund Reason
        <template #control>
          <UiInputText
            v-model="production.name"
            placeholder="Enter refund reason"
          />
        </template>
        <template #helper>
          Please enter a reason for the refund. This will be recorded in the
          system.
        </template>
      </form-label>
      <form-label>
        Support Ticket Reference
        <template #control>
          <UiInputText
            v-model="production.name"
            placeholder="Enter refund reason"
          />
        </template>
      </form-label>
    </UiCard>
  </AdminPage>
</template>

<script>
import useAuthStore from '@/store/auth';

import FormLabel from '~~/components/ui/FormLabel.vue';
import Booking from '~~/classes/Booking';

import BookingStatusEnum from '~~/enums/PayableStatusEnum';

import { dateFormat } from '@/utils/datetime';
import { AdminBookingDetailDocument } from '~~/graphql/codegen/operations';

export default defineNuxtComponent({
  components: {
    FormLabel
  },
  async asyncData() {
    const { data } = await useDefaultApolloClient().query({
      query: AdminBookingDetailDocument,
      variables: {
        bookingReference: useRoute().params.bookingReference
      }
    });

    if (!data.bookings.edges[0]) {
      throw createSafeError({
        statusCode: 404,
        message: 'This booking does not exist'
      });
    }

    const rawBooking = data.bookings.edges[0].node;

    return {
      booking: Booking.fromAPIData(rawBooking),
      rawBooking
    };
  },
  data() {
    return {
      authStore: useAuthStore()
    };
  },
  computed: {
    production() {
      return this.booking.performance.production;
    },
    adminInfo() {
      return [
        ['Status', new BookingStatusEnum(this.rawBooking.status).name],
        [
          'Created At',
          dateFormat(this.rawBooking.createdAt, 'dd/MMM/y HH:mm ZZZZ')
        ],
        [
          'Updated At',
          dateFormat(this.rawBooking.updatedAt, 'dd/MMM/y HH:mm ZZZZ')
        ],
        [
          'Created By',
          `${this.rawBooking.creator.firstName} ${this.rawBooking.creator.lastName} (Email: ${this.rawBooking.creator.email})`
        ],
        [
          'Owned By',
          `${this.rawBooking.user.firstName} ${this.rawBooking.user.lastName} (Email: ${this.rawBooking.user.email})`
        ],
        ['Admin Discount', this.rawBooking.adminDiscountPercentage * 100 + '%']
      ];
    },
    anyTicketsChecked() {
      return this.booking.tickets.some((ticket) => ticket.checkedIn);
    }
  },
  methods: {
    async refundBooking() {
      swal
        .fire({
          title: 'Are you sure?',
          text: 'This will refund the booking and remove it from the system.',
          icon: 'warning',
          showCancelButton: true,
          cancelButtonText: 'No, cancel!',
          showConfirmButton: true,
          confirmButtonText: 'Yes, refund it!',
          input: 'text',
          inputLabel: 'Refund Reason',
          inputPlaceholder: 'Enter refund reason'
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            const { data } = await useDefaultApolloClient().mutate({
              mutation: AdminBookingDetailDocument,
              variables: {
                bookingReference: this.booking.reference
              }
            });

            if (data) {
              this.$router.push('/administration/productions');
            }
          }
        });
    }
  }
});
</script>
