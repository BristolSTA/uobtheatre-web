<!-- eslint-disable vue/no-mutating-props -->
<template>
  <overview-box>
    <template #title>
      <font-awesome-icon icon="info" class="mr-2" />
      Accessibility Info
    </template>
    <div class="p-2 px-4 bg-sta-gray rounded">
      <div class="sm:flex">
        <template v-if="!changingAccessibility">
          <p class="flex-grow py-2">
            {{ booking.accessibilityInfo }}
          </p>
          <UiStaButton
            class="bg-sta-orange hover:bg-sta-orange-dark transition-colors sm:ml-2"
            @click="
              () => {
                newAccessibility = booking.accessibilityInfo;
                changingAccessibility = true;
              }
            "
          >
            Edit
          </UiStaButton>
        </template>
        <template v-else>
          <form-label class="flex-grow">
            <UiInputText
              v-model="newAccessibility"
              placeholder="e.g. Wheelchair seat required"
              :errors="errors"
              required
            />
          </form-label>
          <div class="pt-2 sm:p-0">
            <UiStaButton
              class="bg-sta-green hover:bg-sta-green-dark transition-colors sm:ml-2"
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
              class="bg-sta-rouge hover:bg-sta-rouge-dark transition-colors mx-2"
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
              class="bg-sta-orange hover:bg-sta-orange-dark transition-colors"
              @click="
                () => {
                  changingAccessibility = false;
                }
              "
            >
              Cancel
            </UiStaButton>
          </div>
        </template>
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

export default {
  name: 'TicketsOverview',
  components: { OverviewBox, FormLabel },
  props: {
    booking: {
      required: true,
      type: Booking
    }
  },
  data() {
    return {
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
            text: `Are you sure you remove the accessibility information from this booking?`,
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
        this.errors = getValidationErrors(e);
      }
    }
  }
};
</script>
