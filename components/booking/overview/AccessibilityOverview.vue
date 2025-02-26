<!-- eslint-disable vue/no-mutating-props -->
<template>
  <overview-box>
    <template #title>
      <font-awesome-icon icon="info" class="mr-2" />
      Accessibility Info
    </template>
    <div class="p-2 px-4 bg-sta-gray rounded">
      <template v-if="!changingAccessibility">
        <div class="flex">
          <p class="flex-grow py-2">
            {{ booking.accessibilityInfo }}
          </p>
          <UiStaButton
            class="bg-sta-orange hover:bg-sta-orange-dark transition-colors mx-2"
            @click="
              () => {
                changingAccessibility = true;
                newAccessibility = booking.accessibilityInfo;
              }
            "
          >
            Edit
          </UiStaButton>
        </div>
      </template>
      <template v-else>
        <div class="flex">
          <form-label class="flex-grow">
            <UiInputText
              v-model="newAccessibility"
              placeholder="e.g. Wheelchair seat required"
              :errors="errors"
              required
            />
          </form-label>
          <UiStaButton
            class="bg-sta-green hover:bg-sta-green-dark transition-colors mx-2"
            @click="
              () => {
                booking.accessibilityInfo = newAccessibility;
                updateAPI();
                changingAccessibility = false;
              }
            "
          >
            Save
          </UiStaButton>
        </div>
      </template>
    </div>
  </overview-box>
</template>

<script>
import OverviewBox from '../../ui/UiCard.vue';
import Booking from '~~/classes/Booking';
import UpdateBookingAccessibilityInfo from '~~/graphql/mutations/booking/UpdateBookingAccessibilityInfo.gql';
import { getValidationErrors, performMutation } from '~~/utils/api';

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
  methods: {
    async updateAPI() {
      try {
        if (this.booking.id) {
          // We have a booking, lets update it
          const data = await performMutation(
            this.$apollo,
            {
              mutation: UpdateBookingAccessibilityInfo,
              variables: {
                id: this.booking.id,
                accessibilityInfo: this.booking.accessibilityInfo
              }
            },
            'booking'
          );
          this.booking.updateFromAPIData(data.booking.booking);
        }
      } catch (e) {
        this.errors = getValidationErrors(e);
        return;
      }
    }
  }
};
</script>
