<template>
  <AdminPage title="Refund Booking">
    <h2 class="text-sta-orange text-h2">Reference - {{ booking.reference }}</h2>
    <UiCard title="Booking Cost Breakdown" class="mb-4">
      <loading-container :loading="!booking"
        ><safe-table class="w-full text-center">
          <thead>
            <tr>
              <th colspan="2"></th>
              <th colspan="3" class="underline">Total Price Breakdown</th>
              <th></th>
              <th colspan="4" class="underline">Booking Fee Breakdown</th>
            </tr>
            <tr>
              <th>Total Price</th>
              <th>=</th>
              <!-- Which is comprised of -->
              <th>Ticket Price</th>
              <th class="min-w-9">+ (</th>
              <th>Booking Fee</th>
              <th>=</th>
              <!-- Booking fee is then comprised of -->
              <th>Payment Provider's Fee</th>
              <th>+</th>
              <th>UOB Theatre's Profit</th>
              <th>)</th>
            </tr>
          </thead>
          <tbody>
            <table-row>
              <table-row-item>£{{ booking.totalPricePounds }}</table-row-item>
              <table-row-item>=</table-row-item>
              <table-row-item
                >£{{ booking.ticketsDiscountedPricePounds }}</table-row-item
              >
              <table-row-item>+ (</table-row-item>
              <table-row-item>£{{ booking.appFeePounds }}</table-row-item>
              <table-row-item>=</table-row-item>
              <table-row-item>£{{ booking.providerFeePounds }}</table-row-item>
              <table-row-item>+</table-row-item>
              <table-row-item
                >£{{ booking.websiteProfitPounds }}</table-row-item
              >
              <table-row-item>)</table-row-item>
            </table-row>
          </tbody>
        </safe-table>
      </loading-container>
    </UiCard>
    <UiCard title="Refund Cost Breakdown" class="mb-4">
      <loading-container :loading="!booking">
        <safe-table class="w-full text-center">
          <thead>
            <table-head-item :text-left="false">Refund Type</table-head-item>
            <table-head-item :text-left="false"
              >Refunded to Customer</table-head-item
            >
            <table-head-item :text-left="false"
              >Booking Fees Retained</table-head-item
            >
            <table-head-item :text-left="false"
              >UOB Theatre Profit</table-head-item
            >
            <table-head-item :text-left="false"
              >Production Company Cost</table-head-item
            >
            <table-head-item :text-left="false">Select</table-head-item>
          </thead>
          <tbody>
            <template
              v-for="(refund, index) in [
                app_refund,
                provider_refund,
                full_refund
              ]"
              :key="index"
            >
              <table-row
                :title="
                  refund.type === 'full' &&
                  !authStore.hasPermission('full_refund_booking')
                    ? 'You do not have permission to issue a full refund'
                    : ''
                "
                :class="[
                  'cursor-pointer',
                  refund.type === 'full' &&
                  !authStore.hasPermission('full_refund_booking')
                    ? 'text-gray-400 cursor-not-allowed hover:cursor-not-allowed'
                    : ''
                ]"
              >
                <table-row-item>{{ refund.name }}</table-row-item>
                <table-row-item>
                  <div>£{{ refund.total_refunded }}</div>
                </table-row-item>
                <table-row-item
                  v-for="(field, idx) in [
                    'fee_keep',
                    'our_keep',
                    'society_cost'
                  ]"
                  :key="idx"
                >
                  <div v-if="refund[field] != 0">£{{ refund[field] }}</div>
                  <font-awesome-icon
                    v-else
                    icon="circle-xmark"
                    :class="[
                      refund.type === 'full' &&
                      !authStore.hasPermission('full_refund_booking')
                        ? 'text-gray-400'
                        : 'text-sta-rouge'
                    ]"
                  />
                </table-row-item>
                <table-row-item>
                  <input
                    v-model="refundType"
                    type="radio"
                    name="refundType"
                    :value="refund.type"
                    :disabled="
                      refund.type === 'full' &&
                      !authStore.hasPermission('full_refund_booking')
                    "
                  />
                </table-row-item>
              </table-row>
              <table-row>
                <table-row-item colspan="6" class="text-center">
                  <p class="text-sta-orange">
                    {{ refund.summary }}
                  </p>
                  <p class="text-sm">
                    {{ refund.description }}
                  </p>
                </table-row-item>
              </table-row>
            </template>
          </tbody>
        </safe-table>
      </loading-container>
    </UiCard>
    <UiCard title="Refund Information" class="mb-4">
      <form-label>
        Refund Reason
        <template #control>
          <UiInputText
            v-model="refundReason"
            required
            placeholder="Enter refund reason"
            :errors="errors"
          />
        </template>
        <template #helper> Please enter a reason for the refund. </template>
      </form-label>
      <form-label>
        Support Ticket Reference
        <template #control>
          <UiInputText
            v-model="supportTicketRef"
            required
            placeholder="Enter a support ticket reference"
            :errors="errors"
          />
        </template>
        <template #helper> Match the refund to a support ticket. </template>
      </form-label>
    </UiCard>
    <UiCard>
      <UiStaButton
        v-if="authStore.hasPermission('refund_booking')"
        class="bg-sta-rouge hover:bg-sta-rouge-dark transition-colors mt-2"
        @click="refundBooking"
      >
        Refund Booking
      </UiStaButton>
    </UiCard>
  </AdminPage>
</template>

<script>
import SafeTable from '@/components/ui/Tables/SafeTable.vue';
import TableHeadItem from '@/components/ui/Tables/TableHeadItem.vue';
import TableRow from '@/components/ui/Tables/TableRow.vue';
import TableRowItem from '@/components/ui/Tables/TableRowItem.vue';

import useAuthStore from '@/store/auth';

import LoadingContainer from '~~/components/ui/LoadingContainer.vue';
import FormLabel from '~~/components/ui/FormLabel.vue';
import Booking from '~~/classes/Booking';

import {
  AdminBookingLookupDocument,
  RefundBookingDocument
} from '~~/graphql/codegen/operations';

export default defineNuxtComponent({
  components: {
    FormLabel,
    LoadingContainer,
    SafeTable,
    TableRowItem,
    TableRow,
    TableHeadItem
  },
  async asyncData() {
    const { data } = await useDefaultApolloClient().query({
      query: AdminBookingLookupDocument,
      variables: {
        reference: useRoute().params.bookingReference
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
        type: 'full',
        name: 'Full Refund',
        summary: 'Refunds the full amount paid to the customer.',
        description:
          'This will incur a cost for the production company, who must cover the payment provider fee, invoiced separately. Only administrators can issue this type of refund.',
        total_refunded: (totalPayments / 100).toFixed(2),
        fee_keep: 0,
        our_keep: 0,
        society_cost: (-providerFee / 100).toFixed(2)
      },
      provider_refund: {
        type: 'provider',
        name: 'Provider Refund',
        summary:
          'Keeps fees to cover the payment provider fee, and refunds the rest.',
        description:
          'This is appropriate for refunds due to factors external to the patron, such as production cancellation.',
        total_refunded: ((totalPayments - providerFee) / 100).toFixed(2),
        fee_keep: (providerFee / 100).toFixed(2),
        our_keep: 0,
        society_cost: 0
      },
      app_refund: {
        type: 'app',
        name: 'App Refund',
        summary: 'Keeps the booking fee, and refunds the rest.',
        description: 'This is the default, appropriate for most refunds.',
        total_refunded: ((totalPayments - appFee) / 100).toFixed(2),
        fee_keep: (appFee / 100).toFixed(2),
        our_keep: ((appFee - providerFee) / 100).toFixed(2),
        society_cost: 0
      }
    };
  },
  data() {
    return {
      authStore: useAuthStore(),
      refundType: 'app',
      refundReason: '',
      supportTicketRef: '',
      errors: null
    };
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
          confirmButtonText: 'Yes, refund it!'
        })
        .then(async (result) => {
          if (!result.isConfirmed) return;
          loadingSwal.fire({
            title: 'Refunding Booking',
            text: 'Please wait while we process the refund.',
            allowOutsideClick: false,
            didOpen: () => {
              swal.showLoading();
            }
          });
          try {
            const data = await performMutation(
              this.$apollo,
              {
                mutation: RefundBookingDocument,
                variables: {
                  bookingReference: this.booking.reference,
                  performanceID: this.booking.performance.id,
                  preserveAppFees: this.refundType === 'app',
                  preserveProviderFees: this.refundType !== 'full',
                  refundReason: this.refundReason,
                  supportTicketRef: this.supportTicketRef
                }
              },
              'refundBooking'
            );

            if (data.success) {
              loadingSwal.close();
              successToast.fire({
                title: 'Refund Successful',
                text: 'The booking has been successfully refunded.',
                icon: 'success'
              });
              this.$router.replace(
                `/administration/productions/${this.booking.performance.production.slug}/bookings/${this.booking.reference}`
              );
            }
          } catch (e) {
            this.errors = getValidationErrors(e);
            loadingSwal.close();
            swal.fire({
              title: 'Refund Failed',
              text: this.errors.allErrors.map((e) => e.message).join('\n'),
              icon: 'error'
            });
          }
        });
    }
  }
});
</script>
