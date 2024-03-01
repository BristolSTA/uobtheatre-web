<!-- eslint-disable vue/no-mutating-props -->
<template>
  <UiCard title="Accessibility Details">
    <form-label :errors="errors" name="accessibilityInfo">
      Accessibility Requirements
      <template #control>
        <UiInputText
          v-model="booking.accessibilityInfo"
          name="Accessibility Requirements"
          type="accessibility"
          placeholder="e.g. Wheelchair seat required"
          :errors="errors"
          required
      /></template>
      <template #helper>
        Any accessibility requirements you chose to share with us will be
        communicated by email to the production team. We cannot guarantee that
        your requirements can be met, though a member of the team will be in
        touch to discuss your needs if required. If you have any questions,
        please support@uobtheatre.com.
      </template>
    </form-label>
  </UiCard>
</template>

<script>
import Booking from '~~/classes/Booking';
import Errors from '~~/classes/Errors';
import FormLabel from '../ui/FormLabel.vue';

export default {
  name: 'AccessibilityInput',
  components: {
    FormLabel
  },
  props: {
    booking: {
      required: true,
      type: Booking
    },
    errors: {
      type: Errors,
      default: null
    }
  }
};
</script>
