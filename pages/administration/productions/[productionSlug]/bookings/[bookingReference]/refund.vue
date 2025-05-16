<template>
  <AdminPage title="Refund Booking">
    <h2 class="text-sta-orange text-h2">Reference - {{ booking.reference }}</h2>
    <UiCard title="Refund Type" class="mb-4">
      <loading-container :loading="!booking">
        <table class="w-full text-center">
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Fee Keep</th>
              <th>Our Keep</th>
              <th>Society Cost</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(refund, index) in [
                full_refund,
                app_refund,
                provider_refund
              ]"
              :key="index"
            >
              <td>{{ refund.type }}</td>
              <td>
                <div v-if="refund.total_refunded > 0">
                  £{{ refund.total_refunded }}
                </div>
                <font-awesome-icon
                  v-else
                  :icon="'circle-xmark'"
                  :class="'text-sta-rouge'"
                />
              </td>
              <td>
                <div v-if="refund.fee_keep > 0">£{{ refund.fee_keep }}</div>
                <font-awesome-icon
                  v-else
                  :icon="'circle-xmark'"
                  :class="'text-sta-rouge'"
                />
              </td>
              <td>
                <div v-if="refund.our_keep > 0">£{{ refund.our_keep }}</div>
                <font-awesome-icon
                  v-else
                  :icon="'circle-xmark'"
                  :class="'text-sta-rouge'"
                />
              </td>
              <td>
                <div v-if="refund.society_cost > 0">
                  £{{ refund.society_cost }}
                </div>
                <font-awesome-icon
                  v-else
                  :icon="'circle-xmark'"
                  :class="'text-sta-rouge'"
                />
              </td>
              <td>
                <input
                  v-model="selectedRefundType"
                  type="radio"
                  name="refundType"
                  value="full"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </loading-container>
    </UiCard>
    <UiCard title="Refund Information" class="mb-4">
      <form-label>
        Refund Reason
        <template #control>
          <UiInputText
            v-model="refundReason"
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
            v-model="refundTicketReference"
            placeholder="Enter refund reason"
          />
        </template>
      </form-label>
    </UiCard>
  </AdminPage>
</template>

<script>
import useAuthStore from '@/store/auth';

import LoadingContainer from '~~/components/ui/LoadingContainer.vue';
import FormLabel from '~~/components/ui/FormLabel.vue';
import Booking from '~~/classes/Booking';

import BookingStatusEnum from '~~/enums/PayableStatusEnum';

import { dateFormat } from '@/utils/datetime';
import { AdminBookingDetailDocument } from '~~/graphql/codegen/operations';

export default defineNuxtComponent({
  components: {
    FormLabel,
    LoadingContainer
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
    const booking = Booking.fromAPIData(rawBooking);

    let totalPayments = 0;
    let appFee = 0;
    let providerFee = 0;

    if (booking.salesBreakdown) {
      totalPayments = booking.salesBreakdown.totalPayments;
      appFee = booking.salesBreakdown.appFee;
      providerFee = booking.salesBreakdown.providerPaymentValue;
    }

    return {
      booking,
      rawBooking,
      totalPayments,
      appFee,
      providerFee,
      full_refund: {
        type: 'Full Refund',
        total_refunded: totalPayments,
        fee_keep: 0,
        our_keep: 0,
        society_cost: -providerFee
      },
      app_refund: {
        type: 'App Refund',
        total_refunded: totalPayments - appFee,
        fee_keep: appFee,
        our_keep: appFee - providerFee,
        society_cost: 0
      },
      provider_refund: {
        type: 'Provider Refund',
        total_refunded: totalPayments - providerFee,
        fee_keep: providerFee,
        our_keep: 0,
        society_cost: 0
      }
    };
  },
  data() {
    return {
      authStore: useAuthStore(),
      selectedRefundType: 'app',
      refundReason: '',
      refundTicketReference: ''
    };
  },
  computed: {
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
