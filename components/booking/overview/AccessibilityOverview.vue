<!-- eslint-disable vue/no-mutating-props -->
<template>
  <overview-box>
    <template #title>
      <font-awesome-icon icon="info" class="mr-2" />
      Booking Accessibility
    </template>
    <template #toolbar>
      <UiStaButton
        v-if="allowEdit && !changingAccessibility"
        class="bg-sta-orange hover:bg-sta-orange-dark transition-colors"
        @click="
          () => {
            changingAccessibility = true;
          }
        "
      >
        <p v-if="booking.accessibilityInfo">Edit</p>
        <p v-else>Add</p>
      </UiStaButton>
      <UiStaButton
        v-if="changingAccessibility"
        class="bg-sta-green hover:bg-sta-green-dark transition-colors"
        :disabled="!accessibilityChanged"
        @click="
          () => {
            if (booking.accessibilityInfo !== newAccessibility) {
              updateAPI(newAccessibility);
            }
          }
        "
      >
        Save
      </UiStaButton>
      <UiStaButton
        v-if="changingAccessibility"
        class="bg-sta-rouge hover:bg-sta-rouge-dark transition-colors"
        @click="
          () => {
            newAccessibility = '';
            updateAPI(newAccessibility);
          }
        "
      >
        Remove
      </UiStaButton>
      <UiStaButton
        v-if="changingAccessibility"
        class="bg-sta-orange hover:bg-sta-orange-dark transition-colors"
        @click="
          () => {
            changingAccessibility = false;
          }
        "
      >
        Cancel
      </UiStaButton>
    </template>
    <div class="p-2 px-4 bg-sta-gray rounded">
      <div v-if="!changingAccessibility">
        <p
          v-if="showPrevious && booking.previousAccessibilityInfo"
          class="text-s text-sta-orange"
        >
          Current accessibility information:
        </p>
        <p v-if="booking.accessibilityInfo" class="py-2">
          {{ booking.accessibilityInfo }}
        </p>
        <p v-else class="py-2">No accessibility information provided</p>
        <div v-if="showPrevious && booking.previousAccessibilityInfo">
          <p class="text-s text-sta-orange">
            Previous accessibility information
            {{
              booking.accessibilityInfoUpdatedAt
                ? `(last updated ${new Date(booking.accessibilityInfoUpdatedAt).toLocaleString()})`
                : ''
            }}:
          </p>
          <p v-if="booking.previousAccessibilityInfo" class="py-2">
            {{ booking.previousAccessibilityInfo }}
          </p>
          <p v-else class="py-2">No previous accessibility information</p>
        </div>
      </div>
      <div v-else>
        <form-label>
          <template #control>
            <UiInputText
              v-model="newAccessibility"
              placeholder="e.g. Wheelchair seat required"
              required
            />
          </template>
          <template #helperAfter>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="ACCESSIBILITY_INFO_HELPER_EMAIL" />
          </template>
        </form-label>
      </div>
    </div>
  </overview-box>
</template>

<script>
import Swal from 'sweetalert2';

import OverviewBox from '../../ui/UiCard.vue';
import Booking from '~~/classes/Booking';
import UpdateBookingAccessibilityInfo from '~~/graphql/mutations/booking/UpdateBookingAccessibilityInfo.gql';
import { getValidationErrors, performMutation } from '~~/utils/api';
import { successToast } from '~~/utils/alerts';

import FormLabel from '../../ui/FormLabel.vue';
import { ACCESSIBILITY_INFO_HELPER } from '~/utils/constants';

export default {
  name: 'TicketsOverview',
  components: { OverviewBox, FormLabel },
  props: {
    booking: {
      required: true,
      type: Booking,
      required: true
    },
    allowEdit: {
      type: Boolean,
      default: true
    },
    showPrevious: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      newAccessibility: this.booking.accessibilityInfo,
      changingAccessibility: false,
      errors: null
    };
  },
  computed: {
    accessibilityChanged() {
      return this.booking.accessibilityInfo !== this.newAccessibility;
    }
  },
  methods: {
    async updateAPI(newAccessibility) {
      try {
        if (newAccessibility === '') {
          const swalArgs = {
            title: 'Are you sure?',
            text: `Are you sure you want to remove the accessibility information from this booking?`,
            showCancelButton: true,
            showConfirmButton: true
          };

          const { isConfirmed } = await swal.fire(swalArgs);
          if (!isConfirmed) {
            return;
          }
        } else if (this.booking.accessibilityInfo === '') {
          const swalArgs = {
            title: 'Are you sure?',
            text: ACCESSIBILITY_INFO_HELPER,
            showCancelButton: true,
            showConfirmButton: true
          };

          const { isConfirmed } = await swal.fire(swalArgs);
          if (!isConfirmed) {
            return;
          }
        }

        loadingSwal.fire();

        if (this.booking.id) {
          // We have a booking, lets update it
          const data = await performMutation(
            this.$apollo,
            {
              mutation: UpdateBookingAccessibilityInfo,
              variables: {
                id: this.booking.id,
                accessibilityInfo: newAccessibility
              }
            },
            'updateBookingAccessibilityInfo'
          );
        }
        Swal.close();
        this.changingAccessibility = false;
        // eslint-disable-next-line vue/no-mutating-props
        this.booking.accessibilityInfo = newAccessibility;
        successToast.fire({ title: 'Accessibility information updated' });
      } catch (e) {
        Swal.close();
        errorToast.fire({ title: 'Error updating accessibility information' });
        this.errors = getValidationErrors(e);
      }
    }
  }
};
</script>
